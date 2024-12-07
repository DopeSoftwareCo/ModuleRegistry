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
import { ensureUploadFoldersExist } from "../Utils/FileDir";

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
            const response = await fetch(apiUrl, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                    Accept: "application/vnd.github.v3+json", // Optional: for proper GitHub API versioning
                },
            });
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
        ensureUploadFoldersExist();
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
            console.log("no url, but with content");
            // Confirmed that content exists, decode and extract repository URL.
            let base64Data = content;
            if (content.includes(",")) {
                console.log("content includes comma (FE)");
                const base64Data = content.split(",")[1];
                binaryContent = Buffer.from(base64Data, "base64");
                repositoryUrl = repositoryUrl as unknown as string; // Type casts it from "string | undefined" to "string"
            } else {
                console.log("content does not include comma (maybe autograder or other request)");
                binaryContent = Buffer.from(base64Data, "base64");
                repositoryUrl = repositoryUrl as unknown as string;
            }
        } else if (content == undefined && repositoryUrl != undefined) {
            // Confirmed that the repoURL exists, download content
            console.log("no content, but we have repo url");
            let repoDownloadURL: string;
            try {
                console.log(`Trying to download: ${repositoryUrl}`);
                if (repositoryUrl.includes("github")) {
                    console.log("Url is a github url");
                    repoDownloadURL = await getGitHubDownload(repositoryUrl);
                } else {
                    console.log("Url is not a github url");
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
            console.log("Downloading repository...");
            const response = await axios.get(repoDownloadURL, { responseType: "arraybuffer" });
            binaryContent = Buffer.from(response.data, "binary");
            isExternal = true;
        } else {
            console.log(
                "Content and url are undefined or both defined, which should never happen due to validation, cleaning..."
            );
            await cleanUp(tempID);
            console.error("Should only get here if both content and URL are undefined or they are defined");
            responseMessage =
                "There is missing field(s) in the PackageData or it is formed improperly (e.g. Content and URL are both set)";
            console.log(`/pacakge : ${responseMessage}`);
            res.status(424).send(responseMessage);
            return;
        }

        try {
            console.log(`Creating temp file for: ${repositoryUrl} at location: ${tempFileZip}`);
            fs.promises.writeFile(tempFileZip, binaryContent);
            console.log(`Successfully created temp file for: ${repositoryUrl} at location: ${tempFileZip}`);
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
        console.log(
            `Using unzipper to open temp file for: ${repositoryUrl} at location: ${tempUnzippedFileDirectory}`
        );
        await unzipper.Open.buffer(binaryContent).then((directory) =>
            directory.extract({ path: tempUnzippedFileDirectory })
        );
        console.log(
            `Successfully unzipped temp file for: ${repositoryUrl} at location: ${tempUnzippedFileDirectory}`
        );
        let nestedFolder = ""; // If everything is in package root, will search for everything there
        const tempDirectoryListing = await fs.promises.readdir(tempUnzippedFileDirectory, {
            withFileTypes: true,
        });
        console.log("Directory listing length: " + tempDirectoryListing.length);
        if (tempDirectoryListing.length == 1) {
            console.log(
                `temp dir listing length was 1... saying nested folder is this: /${tempDirectoryListing[0].name}`
            );
            nestedFolder = `/${tempDirectoryListing[0].name}`;
        }

        let packageJsonFile;
        try {
            console.log(
                `Attempting to open package.json file ${repositoryUrl} at location: ${tempUnzippedFileDirectory}${nestedFolder}/package.json`
            );
            packageJsonFile = await fs.promises.readFile(
                path.join(tempUnzippedFileDirectory + nestedFolder, "package.json"),
                "utf-8"
            );
            console.log(
                `Successfully opened package.json file ${repositoryUrl} at location: ${tempUnzippedFileDirectory}${nestedFolder}/package.json`
            );
        } catch (error) {
            console.log("Error when opening package.json file.");
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
        console.log("Attempting to parse package.json file");
        const packageJson = JSON.parse(packageJsonFile.toString());
        console.log("JSON Parsed");
        if (!isExternal) {
            console.log("Not an external package");
            try {
                console.log("Trying to find the repo url");
                repositoryUrl = findRepoUrl(packageJson);
                console.log("Finding repo url completed.");
                if (!repositoryUrl) {
                    throw new Error("Did not find repo url.");
                }
            } catch (error) {
                console.log("Error occured when NOT external package, trying to find repo url from json");
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
        console.log("Checking to see if the package exists.");
        const queriedPackage = await PackageModel.exists({ repoUrl: repositoryUrl });
        console.log("Queried a package");
        let standaloneCost: number;
        let totalCost: number;
        if (queriedPackage !== null) {
            console.log("queried package was not null, meaning package exists. returning...");
            console.log(queriedPackage);
            await cleanUp(tempID);
            responseMessage = "Package exists already.";
            console.log(`/pacakge : ${responseMessage}`);
            res.status(409).send(responseMessage);
            return;
        } else {
            // Checks if Disqualified
            console.log("Package was null, meaning it does not exist.");
            console.log("Getting standalone cost");
            standaloneCost = await CalculateStandaloneCost(repositoryUrl); // No deps
            console.log("Getting total cost");
            totalCost = await CalculateTotalCost(repositoryUrl); // With deps
            console.log("Checking disqualification");
            if (totalCost > disqualifiedTotalSizeInGB || standaloneCost > disqualifiedStandaloneSizeInGB) {
                console.log("Cleaning up due to disqualification.");
                await cleanUp(tempID);
                console.log("Cleaned up after disqual, returning");
                responseMessage = "Package is not uploaded due to disqualified rating.";
                console.log(`/pacakge : ${responseMessage}`);
                res.status(424).send(responseMessage);
            }
        }
        console.log("Creating evaluator...");
        const evaluator = new ModuleEvaluator(DEFAULT_WEIGHTS);
        const builder = new SuperRepoBuilder(DEFAULT_WEIGHTS);
        let jsonRow;
        const zipFileExtension = ".zip";
        console.log("Building for eval");
        const repoForEval = await builder.SuperBuild(repositoryUrl ? repositoryUrl : "");
        console.log("Built for eval");
        if (repoForEval && repositoryUrl) {
            console.log("repo exists and repo url exists... evaluating...");
            await evaluator.Eval(repoForEval);
            console.log("Evaluated, setting ndjson row");
            jsonRow = repoForEval.NDJSONRow;
            console.log("Row set");
        }
        console.log("Building mongo package...");
        const mongoPackageID = await buildMongoDBPackage(
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
        );
        console.log(`Mongo package for: ${repositoryUrl} built and saved under ID: ${mongoPackageID}`);
        const packageID = `${mongoPackageID}${zipFileExtension}`;
        console.log(`zip for package ${packageID}`);
        if (body.debloat == true) {
            // Zip up, and store
            console.log("Debloat was true, running debloat");
            const isSuccessful = await debloatUnzippedContent(tempUnzippedFileDirectory);
            if (isSuccessful) {
                console.log("Debloat was successful");
                zipContents(
                    tempUnzippedFileDirectory,
                    zipFileExtension,
                    path.join(packagesDirectory, packageID)
                );
                console.log("Zipping contents");
            } else {
                console.log("Debloat was not successful, renaming?");
                await fs.promises.rename(tempFileZip, path.join(packagesDirectory, packageID));
                console.log("Rename complete after unsuccessful debloat");
            }
        } else {
            // Just move the existing zip to Data and rename to the ID.
            console.log(`Debloat was false or not set for: ${repositoryUrl} renaming file?`);
            await fs.promises.rename(tempFileZip, path.join(packagesDirectory, packageID));
            console.log(`Debloat was false or not set for: ${repositoryUrl} file successfully renamed`);
        }
        console.log("Cleaning up again");
        await cleanUp(tempID);
        console.log("clean up completed.");
        console.log("building return body...");
        const returnBody: UploadInjestNewPackageResponseBody = {
            metadata: {
                Name: packageJson.name,
                Version: packageJson.version,
                ID: mongoPackageID,
            },
            //all fields are optional in data
            data: {},
        };
        console.log("return body built., sending response....");
        console.log(`/pacakge : ${JSON.stringify(returnBody)}`);
        res.status(200).json(returnBody);
        return;
    }
);
