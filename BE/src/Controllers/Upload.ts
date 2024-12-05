// Refactor of AWFUL code

/*import { UploadInjestPackageRequest } from "RequestTypes";
import asyncHandler from "../Middleware/asyncHandler";
import {
    UploadInjestNewPackageResponse,
    UploadInjestNewPackageResponseBody,
    UploadInjestResponseMessages,
} from "ResponseTypes";
import { NextFunction } from "express";
import PackageModel from "../Schemas/Package";
import { CalculateStandaloneCost, CalculateTotalCost } from "../Services/Packages/Cost/CalcPackageCost";
import {
    debloatUnzippedContent,
    zipContents,
} from "../Services/Packages/PackageZipHandling";
import fs from "fs";
import axios from "axios";
import path from "path";
import unzipper from "unzipper";
import { ModuleEvaluator } from "../Providers/RepoEvaluator/ModuleEvaluator";
import { DEFAULT_WEIGHTS } from "../Providers/RepoEvaluator/RepoComponents/Metrics_Scores/Weightspec.const";
import { SuperRepoBuilder } from "../Providers/RepoEvaluator/RepoComponents/Builders/SuperRepoBuilder";
import { buildMongoDBPackage as BuildMongoPackage } from "../Services/Packages/MongoDB";
import fetch from "node-fetch";
import { ensureUploadFoldersExist } from "../Utils/FileDir";

const packagesDirectory = path.join(process.cwd(), "Data/Packages");
const tempDirectory = path.join(packagesDirectory, ".Temp");
const zipFileExtension = ".zip";

// Helper Functions
export type content = { content: Buffer; isExternal: boolean; };


async function GetContentFromGitHub(repoURL: string): Promise<string> {
    const regex = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)/;
    const match = repoURL.match(regex);

    if (!match) {
        throw new Error("Invalid GitHub URL");
    }

    const [_, owner, repo] = match;
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`);
    }

    const repoData = await response.json();
    const defaultBranch = repoData.default_branch || "main";
    return `https://github.com/${owner}/${repo}/archive/refs/heads/${defaultBranch}.zip`;
}

async function SaveTempFile(filePath: string, content: Buffer): Promise<void> {
    await fs.promises.writeFile(filePath, content);
}

async function UnzipFolder(buffer: Buffer, destination: string): Promise<void> {
    const directory = await unzipper.Open.buffer(buffer);
    await directory.extract({ path: destination });
}

function findRepoUrl(packageJson: any): string | null {
    if (packageJson.repository) {
        if (typeof packageJson.repository === "string") {
            return packageJson.repository;
        }
        if (typeof packageJson.repository === "object" && packageJson.repository.url) {
            return packageJson.repository.url;
        }
    }
    return null;
}

async function CleanTemps(tempID: string): Promise<void> {
    const tempFileZip = path.join(tempDirectory, `${tempID}${zipFileExtension}`);
    const tempUnzippedDir = path.join(tempDirectory, tempID);

    await Promise.all([
        fs.promises.rm(tempFileZip, { recursive: true, force: true }).catch(() => {}),
        fs.promises.rm(tempUnzippedDir, { recursive: true, force: true }).catch(() => {}),
    ]);
}

async function validateRepository(repositoryUrl: string, tempID: string): Promise<content> {
    if (!repositoryUrl.includes("github")) {
        throw new Error("Invalid repository URL. Only GitHub URLs are supported.");
    }

    const repoDownloadURL = await GetContentFromGitHub(repositoryUrl);
    const response = await axios.get(repoDownloadURL, { responseType: "arraybuffer" });
    return { content: Buffer.from(response.data, "binary"), isExternal: true };
}

async function MakeContentBinary(content_base64: string): Promise<content> {
    const base64 = content_base64.includes(",") ? content_base64.split(",")[1] : content_base64;
    return { content: Buffer.from(base64, "base64"), isExternal: false };
}

async function ParsePackageJson(tempDirectory: string, nestedFolder: string): Promise<any> {
    const packageJsonPath = path.join(tempDirectory, nestedFolder, "package.json");
    const packageJsonContent = await fs.promises.readFile(packageJsonPath, "utf-8");
    return JSON.parse(packageJsonContent);
}

async function SavePackage(
    packageData: any,
    repositoryUrl: string,
    body: any,
    isExternal: boolean,
    standaloneCost: number,
    totalCost: number
): Promise<string> {
    const evaluator = new ModuleEvaluator(DEFAULT_WEIGHTS);
    const builder = new SuperRepoBuilder(DEFAULT_WEIGHTS);
    const repoForEval = await builder.SuperBuild(repositoryUrl);
    let jsonRow;

    if (repoForEval) {
        await evaluator.Eval(repoForEval);
        jsonRow = repoForEval.NDJSONRow;
    }

    return BuildMongoPackage(
        {
            ...jsonRow,
            GoodPinningPracticeScore: 0,
            GoodPinningPracticeLatency: 0,
            PullRequestScore: 0,
            PullRequestLatency: 0,
        },
        repositoryUrl,
        body.Name || packageData.name || "Unknown",
        packageData.version || "1.0.0",
        packageData.license || "Unknown",
        isExternal,
        standaloneCost,
        totalCost
    );
}

// Main Controller
export const UploadInjestController = asyncHandler(
    async (req: UploadInjestPackageRequest, res: UploadInjestNewPackageResponse, next: NextFunction) => {
        ensureUploadFoldersExist();
        const URL = req.body.URL;
        const content = req.body.Content;
        const debloat = req.body.debloat;

        const tempID = Math.floor(Math.random() * 1000 + 1).toString();
        const tempFileZip = path.join(tempDirectory, `${tempID}${zipFileExtension}`);
        const tempUnzippedDir = path.join(tempDirectory, tempID);
        
        let result: BinaryContent;
        
        try {
            let content: Buffer;
            let isExternal: boolean = 
            ;

            if (URL) {
                result = await validateRepository(URL, tempID);
            } else if (content) {
                result = MakeContentBinary(content);
            } else {
                throw new Error("Both content and repository URL are missing or invalid.");
            }

            await SaveTempFile(tempFileZip, content);
            await UnzipFolder(content, tempUnzippedDir);

            const tempDirListing = await fs.promises.readdir(tempUnzippedDir, { withFileTypes: true });
            const nestedFolder = tempDirListing.length === 1 ? `/${tempDirListing[0].name}` : "";
            const packageData = await ParsePackageJson(tempUnzippedDir, nestedFolder);

            const repoUrl = isExternal ? URL : findRepoUrl(packageData);
            if (!repoUrl) {
                throw new Error("Repository URL not found in package data.");
            }

            const existingPackage = await PackageModel.exists({ repoUrl });
            if (existingPackage) {
                throw new Error("Package already exists.");
            }

            const standaloneCost = await CalculateStandaloneCost(repoUrl);
            const totalCost = await CalculateTotalCost(repoUrl);

            if (standaloneCost > 750 || totalCost > 1000) {
                throw new Error("Package disqualified due to high costs.");
            }

            const mongoPackageID = await SavePackage(
                packageData,
                repoUrl,
                req.body,
                isExternal,
                standaloneCost,
                totalCost
            );

            const packageID = `${mongoPackageID}${zipFileExtension}`;
            if (debloat) {
                const debloatSuccessful = await debloatUnzippedContent(tempUnzippedDir);
                if (debloatSuccessful) {
                    zipContents(tempUnzippedDir, zipFileExtension, path.join(packagesDirectory, packageID));
                } else {
                    await fs.promises.rename(tempFileZip, path.join(packagesDirectory, packageID));
                }
            } else {
                await fs.promises.rename(tempFileZip, path.join(packagesDirectory, packageID));
            }

            const responseBody: UploadInjestNewPackageResponseBody = {
                metadata: {
                    Name: packageData.name,
                    Version: packageData.version,
                    ID: mongoPackageID,
                },
                data: {},
            };

            res.status(200).json(responseBody);
        } catch (error) {
            await CleanTemps(tempID);
            res.status(424).send(error.message);
        }
    }
);
*/
