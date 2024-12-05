import { UploadInjestPackageRequest } from "RequestTypes";
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
    debloatUploadedContent,
    zipContents,
} from "../Services/Packages/PackageZipHandling";
import fs from "fs";
import axios from "axios";
import path from "path";
import unzipper, { Entry } from "unzipper";
import { ModuleEvaluator } from "../Providers/RepoEvaluator/ModuleEvaluator";
import { DEFAULT_WEIGHTS } from "../Providers/RepoEvaluator/RepoComponents/Metrics_Scores/Weightspec.const";
import { SuperRepoBuilder } from "../Providers/RepoEvaluator/RepoComponents/Builders/SuperRepoBuilder";
import { buildMongoDBPackage } from "../Services/Packages/MongoDB";
import fetch from "node-fetch";

async function getGitHubDownload(repoURL: string): Promise<string> {
    //return repoURL;
    ///*
    const regex = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)/;
    const match = repoURL.match(regex);

    if (match) {
        const owner = match[1];
        const repo = match[2];
        if (owner == null || repo == null) {
        }

        // Use GitHub API to get the default branch
        const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.statusText}`);
            }
            const repoData = await response.json();
            const defaultBranch = repoData.default_branch || "main"; // Fallback to 'main' if no default branch found
            return `https://github.com/${owner}/${repo}/archive/refs/heads/${defaultBranch}.zip`;
        } catch (error) {
            throw new Error(`Failed to fetch default branch: ${error}`);
        }
    }
    throw new Error("Invalid GitHub URL");
    //*/
}

const packagesDirectory = path.join(process.cwd(), "Data/Packages");
const tempDirectory = packagesDirectory + "/.Temp";

const findRepoUrl = (packageJson: any) => {
    try {
        if (packageJson.repository) {
            if (typeof packageJson.repository === "string") {
                return packageJson.repository; // Direct URL
            }
            if (typeof packageJson.repository === "object" && packageJson.repository.url) {
                return packageJson.repository.url; // URL in object form
            }
        }
        return null;
    } catch (error) {
        console.error(`Error reading or parsing package.json`);
        return null;
    }
};

async function cleanUp(tempID: string) {
    const tempFileZip = path.join(tempDirectory, tempID + ".zip");
    const tempUnzippedFileDirectory = path.join(tempDirectory, tempID);
    if (fs.existsSync(tempFileZip)) {
        await fs.promises.rm(tempDirectory, { recursive: true, force: true });
    }
    if (fs.existsSync(tempUnzippedFileDirectory)) {
        await fs.promises.rm(tempUnzippedFileDirectory, { recursive: true, force: true });
    }
}

export const UploadInjestController = asyncHandler(
    async (req: UploadInjestPackageRequest, res: UploadInjestNewPackageResponse, next: NextFunction) => {
        console.log("Entering Upload Process");
        const body = req.body;
        let repositoryUrl = body?.URL;
        let content = body?.Content;
        let binaryContent; // Meant to store the non-string encoded version
        let isExternal = false;

        const disqualifiedStandaloneSizeInGB = 750; // Approximately 1GB
        const disqualifiedTotalSizeInGB = 1000; // Approximately 1GB
        const tempIDCeiling = 1000;
        const tempID = Math.floor(Math.random() * tempIDCeiling + 1).toString();
        const tempFileZip = path.join(tempDirectory, tempID + ".zip");
        const tempUnzippedFileDirectory = path.join(tempDirectory, tempID);

        let responseMessage: UploadInjestResponseMessages;
        if (repositoryUrl == undefined && content != undefined) {
            // Confirmed that content exists, decode and extract repository URL.
            const base64Data = content.split(",")[1];
            binaryContent = Buffer.from(base64Data, "base64");
            repositoryUrl = repositoryUrl as unknown as string; // Type casts it from "string | undefined" to "string"
        } else if (content == undefined && repositoryUrl != undefined) {
            // Confirmed that the repoURL exists, download content
            let repoDownloadURL: string;
            try {
                if (repositoryUrl.includes("github")) {
                    repoDownloadURL = await getGitHubDownload(repositoryUrl);
                } else {
                    console.error("Not a valid URL");
                    responseMessage =
                        "There is missing field(s) in the PackageData or it is formed improperly (e.g. Content and URL are both set)";
                    console.log(`/pacakge : ${responseMessage}`);
                    res.status(424).send(responseMessage);
                    return;
                }
            } catch (error) {
                console.log(error);
                console.log("Error in getting the download link");
                responseMessage =
                    "There is missing field(s) in the PackageData or it is formed improperly (e.g. Content and URL are both set)";
                console.log(
                    `/pacakge : ${responseMessage} -> ${
                        error instanceof Error ? error.message : "Unkown error in upload"
                    }`
                );
                res.status(424).send(responseMessage);
                return;
            }
            console.log("Repo URL: " + repositoryUrl);
            console.log("Repo Download URL: " + repoDownloadURL);
            const response = await axios.get(repoDownloadURL, { responseType: "arraybuffer" });
            binaryContent = Buffer.from(response.data, "binary");
            isExternal = true;
        } else {
            await cleanUp(tempID);
            console.error("Should only get here if both content and URL are undefined or they are defined");
            responseMessage =
                "There is missing field(s) in the PackageData or it is formed improperly (e.g. Content and URL are both set)";
            console.log(`/pacakge : ${responseMessage}`);
            res.status(424).send(responseMessage);
            return;
        }

        try {
            fs.promises.writeFile(tempFileZip, binaryContent);
        } catch (error) {
            await cleanUp(tempID);
            console.error(`Error: ${error}`);
            responseMessage =
                "There is missing field(s) in the PackageData or it is formed improperly (e.g. Content and URL are both set)";
            console.log(
                `/pacakge : ${responseMessage} -> ${
                    error instanceof Error ? error.message : "Unkown error in upload"
                }`
            );
            res.status(424).send(responseMessage);
            return;
        }

        await unzipper.Open.buffer(binaryContent).then((directory) =>
            directory.extract({ path: tempUnzippedFileDirectory })
        );
        let nestedFolder = ""; // If everything is in package root, will search for everything there
        const tempDirectoryListing = await fs.promises.readdir(tempUnzippedFileDirectory, {
            withFileTypes: true,
        });
        console.log("Directory listing length: " + tempDirectoryListing.length);
        if (tempDirectoryListing.length == 1) {
            nestedFolder = `/${tempDirectoryListing[0].name}`;
        }
        let packageJsonFile;
        try {
            packageJsonFile = await fs.promises.readFile(
                path.join(tempUnzippedFileDirectory + nestedFolder, "package.json"),
                "utf-8"
            );
        } catch (error) {
            console.error(error);
            await cleanUp(tempID);
            responseMessage =
                "There is missing field(s) in the PackageData or it is formed improperly (e.g. Content and URL are both set)";
            console.log(
                `/pacakge : ${responseMessage} -> ${
                    error instanceof Error ? error.message : "Unkown error in upload"
                }`
            );
            res.status(424).send(responseMessage);
            return;
        }

        const packageJson = JSON.parse(packageJsonFile.toString());
        console.log("JSON Parsed");
        if (!isExternal) {
            try {
                repositoryUrl = findRepoUrl(packageJson);
                if (!repositoryUrl) {
                    throw new Error("Did not find repo url.");
                }
            } catch (error) {
                console.error(error);
                console.error("No Repo URL Found!");
                await cleanUp(tempID);
                responseMessage =
                    "There is missing field(s) in the PackageData or it is formed improperly (e.g. Content and URL are both set)";
                console.log(
                    `/pacakge : ${responseMessage} -> ${
                        error instanceof Error ? error.message : "Unkown error in upload"
                    }`
                );
                res.status(424).send(responseMessage);
                return;
            }
        }
        console.log("Repo URL: " + repositoryUrl);

        // Checks if exists
        const queriedPackage = await PackageModel.exists({ repoUrl: repositoryUrl });
        let standaloneCost: number;
        let totalCost: number;
        if (queriedPackage !== null) {
            console.log(queriedPackage);
            await cleanUp(tempID);
            responseMessage = "Package exists already.";
            console.log(`/pacakge : ${responseMessage}`);
            res.status(409).send(responseMessage);
            return;
        } else {
            // Checks if Disqualified
            standaloneCost = await CalculateStandaloneCost(repositoryUrl); // No deps
            totalCost = await CalculateTotalCost(repositoryUrl); // With deps
            if (totalCost > disqualifiedTotalSizeInGB || standaloneCost > disqualifiedStandaloneSizeInGB) {
                await cleanUp(tempID);
                responseMessage = "Package is not uploaded due to disqualified rating.";
                console.log(`/pacakge : ${responseMessage}`);
                res.status(424).send(responseMessage);
            }
        }

        const evaluator = new ModuleEvaluator(DEFAULT_WEIGHTS);
        const builder = new SuperRepoBuilder(DEFAULT_WEIGHTS);
        let jsonRow;
        const zipFileExtension = ".zip";
        const repoForEval = await builder.SuperBuild(repositoryUrl ? repositoryUrl : "");
        if (repoForEval && repositoryUrl) {
            await evaluator.Eval(repoForEval);
            jsonRow = repoForEval.NDJSONRow;
        }
        const packageID =
            (await buildMongoDBPackage(
                {
                    ...jsonRow,
                    GoodPinningPracticeScore: 0,
                    GoodPinningPracticeLatency: 0,
                    PullRequestScore: 0,
                    PullRequestLatency: 0,
                },
                repositoryUrl,
                body.Name ? body.Name : packageJson.name ? packageJson.name : "Unknown", // Should never be unknown, but since this is a safety, it is here.
                packageJson.version ? packageJson.version : "1.0.0",
                packageJson.license ? packageJson.license : "Unknown",
                isExternal,
                standaloneCost,
                totalCost
            )) + zipFileExtension;
        if (body.debloat == true) {
            // Zip up, and store
            const isSuccessful = await debloatUnzippedContent(tempUnzippedFileDirectory);
            if (isSuccessful) {
                zipContents(
                    tempUnzippedFileDirectory,
                    zipFileExtension,
                    path.join(packagesDirectory, packageID)
                );
            } else {
                await fs.promises.rename(tempFileZip, path.join(packagesDirectory, packageID));
            }
        } else {
            // Just move the existing zip to Data and rename to the ID.
            await fs.promises.rename(tempFileZip, path.join(packagesDirectory, packageID));
        }
        const cleanupProcess = cleanUp(tempID);
        const returnBody: UploadInjestNewPackageResponseBody = {
            metadata: {
                Name: packageJson.name,
                Version: packageJson.version,
                ID: packageID,
            },
            //all fields are optional in data
            data: {},
        };
        await cleanupProcess;
        console.log(`/pacakge : ${JSON.stringify(returnBody)}`);
        res.status(200).json(returnBody);
        return;
    }
);
