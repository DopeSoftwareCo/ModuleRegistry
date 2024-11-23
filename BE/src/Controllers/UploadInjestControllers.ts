import { UploadInjestPackageRequest } from "RequestTypes";
import asyncHandler from "../Middleware/asyncHandler";
import {
    UploadInjestNewPackageResponse,
    UploadInjestNewPackageResponseBody,
    UploadInjestResponseMessages,
} from "ResponseTypes";
import { NextFunction } from "express";
import PackageModel from "../Schemas/Package";
import { CalculateStandaloneCost, CalculateTotalCost } from "../Services/CalcPackageCost";
import { debloatUnzippedContent, debloatUploadedContent, zipContents } from "../DSinc_Modules/DSinc_PackageHandling";
import fs from 'fs';
import axios from 'axios';
import path from 'path';
import unzipper, { Entry } from 'unzipper'
import { ModuleEvaluator } from "../Providers/ModEval/ModuleEvaluator";
import { DEFAULT_WEIGHTS } from "../Providers/ModEval/RepoComponents/Metrics_Scores/Weightspec.const";
import { SuperRepoBuilder } from "../Providers/ModEval/RepoComponents/Builders/SuperRepoBuilder";
import { buildMongoDBPackage } from "../Services/MongoDB";
import fetch from "node-fetch";

async function getNPMDownload(repoURL: string): Promise<string> {
    return repoURL;
    /*
    const regex = /https:\/\/www\.npmjs\.com\/package\/([^\/]+)/;
    const match = repoURL.match(regex);
    
    if (match) {
        const packageName = match[1];
        if (packageName == null) {
            throw new Error ('Failed to fetch NPM package data')
        }
        try {
            const packageData = await fetch.json(`/${packageName}`);
            return packageData.repository;
        } catch (error) {
            throw new Error('Failed to fetch NPM package data');
        }
    }
    throw new Error('Invalid NPM URL');
    */
}

async function getGitHubDownload(repoURL: string): Promise<string> {
    return repoURL;
    /*
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
            const defaultBranch = repoData.default_branch || 'main'; // Fallback to 'main' if no default branch found
            return `https://github.com/${owner}/${repo}/archive/refs/heads/${defaultBranch}.zip`;
        } 
        catch (error) {
            throw new Error(`Failed to fetch default branch: ${error}`);
        }
    }
    throw new Error('Invalid GitHub URL');
    */
}

export const UploadInjestController = asyncHandler(
    async (req: UploadInjestPackageRequest, res: UploadInjestNewPackageResponse, next: NextFunction) => {
        console.error("WELCOME TO UPLOAD!");
        const body = req.body; 
        let repositoryUrl = body?.URL;
        let content = body?.Content;
        let binaryContent; // Meant to store the non-string encoded version
        let getRepoURL = false;
        let isExternal = false;


        const disqualifiedStandaloneSizeInGB = 750 // Approximately 1GB
        const disqualifiedTotalSizeInGB = 1000 // Approximately 1GB
        const packagesDirectory = path.join(process.cwd(), "Data/Packages");
        const tempDirectory = packagesDirectory + "/.Temp"
        const tempIDCeiling = 1000;
        const tempID = (Math.floor((Math.random() * tempIDCeiling) + 1)).toString();
        const tempFileZip = path.join(tempDirectory, tempID + ".zip");
        const tempUnzippedFileDirectory = path.join(tempDirectory, tempID);
        const archiver = require("archiver");

        if (!fs.existsSync(tempDirectory)) { // This is where data is downloaded before being examined. 
            fs.mkdirSync(tempDirectory);
        }

        let responseMessage: UploadInjestResponseMessages;
        let isNPMLink: boolean = false;
        if (repositoryUrl == undefined && content != undefined) {
            // Confirmed that content exists, decode and extract repository URL.
            const base64Data = content.split(",")[1];
            binaryContent = Buffer.from(base64Data, "base64");
            repositoryUrl = repositoryUrl as unknown as string; // Type casts it from "string | undefined" to "string"
            getRepoURL = true;
        }
        else if (content == undefined && repositoryUrl != undefined) {
            // Confirmed that the repoURL exists, download content
            try { 
                if (repositoryUrl.includes("npmjs")) {
                    repositoryUrl = await getNPMDownload(repositoryUrl);
                    isNPMLink = true;
                }
                else if (repositoryUrl.includes("github")) {
                    repositoryUrl = await getGitHubDownload(repositoryUrl);
                }
                else {
                    responseMessage = "There is missing field(s) in the PackageData or it is formed improperly (e.g. Content and URL are both set)";
                    res.status(424).send(responseMessage);
                    return;
                }
            }
            catch (error) {
                console.log(error);
                console.log("Error in getting the download link");
                responseMessage = "There is missing field(s) in the PackageData or it is formed improperly (e.g. Content and URL are both set)";
                res.status(424).send(responseMessage);
                return;
            }
            const response = await axios.get(repositoryUrl,{ responseType: 'arraybuffer' });
            binaryContent = Buffer.from(response.data, 'binary');
            isExternal = true;
        }
        else {
            responseMessage = "There is missing field(s) in the PackageData or it is formed improperly (e.g. Content and URL are both set)";
            res.status(424).send(responseMessage);
            return;
        }

        try {
            fs.promises.writeFile(tempFileZip, binaryContent);
        }
        catch {
            fs.unlink(tempFileZip, (err) => {
                if (err) {
                    console.error("Filesystem error, deleting temp file.")
                }
                throw new Error(`Error: ${err}`);
            });
        }
        
        await unzipper.Open.buffer(binaryContent).then((directory) => directory.extract ({ path: tempUnzippedFileDirectory}));
        let nestedFolder = ""; // If everything is in package root, will search for everything there
        const tempDirectoryListing = await fs.promises.readdir(tempDirectory);
        if (tempDirectoryListing.length == 1) {
            nestedFolder = `/${tempDirectoryListing[0]}`
        }
        let packageJsonFile; 
        try {
            packageJsonFile = await fs.promises.readFile(path.join(tempUnzippedFileDirectory + "nestedFolder", "package.json)"), 'utf-8');
        }
        catch (error) {
            responseMessage = "There is missing field(s) in the PackageData or it is formed improperly (e.g. Content and URL are both set)";
            res.status(424).send(responseMessage);
            return;
        }
        
        const packageJson = JSON.parse(packageJsonFile.toString());
        //ENOENT: no such file or directory, open '/mnt/Shared/Shared Drive/School/Software Engineering/Homework/Phase 2/BE/Data/Packages/.Temp/357/ModuleRegistry-dev/package.json'

        repositoryUrl = packageJson.repository.url as string;

        // Checks if exists
        const queriedPackage = await PackageModel.exists({ repoUrl: repositoryUrl})
        let standaloneCost: number;
        let totalCost: number;
        if (queriedPackage !== null) {
            console.log(queriedPackage);
            responseMessage = "Package exists already.";
            res.status(409).send(responseMessage);
            return;
        }
        else { // Checks if Disqualified
            standaloneCost = await CalculateStandaloneCost(repositoryUrl); // No deps
            totalCost = await CalculateTotalCost(repositoryUrl); // With deps
            if (totalCost > disqualifiedTotalSizeInGB || standaloneCost > disqualifiedStandaloneSizeInGB) {
                responseMessage = "Package is not uploaded due to disqualified rating.";
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
        const packageID = await buildMongoDBPackage(
            {
                ...jsonRow,
                GoodPinningPracticeScore: 0,
                GoodPinningPracticeLatency: 0,
                PullRequestScore: 0, 
                PullRequestLatency: 0
            },
            repositoryUrl, 
            packageJson.name, 
            packageJson.version, 
            packageJson.licence, 
            false, 
            standaloneCost,
            totalCost) + zipFileExtension;
        
        if (body.debloat == true) {
            // Zip up, and store
            const isSuccessful = await debloatUnzippedContent(tempUnzippedFileDirectory);
            if (isSuccessful) {
                zipContents(tempUnzippedFileDirectory, zipFileExtension, path.join(packagesDirectory, packageID));
            }
            else if (isNPMLink) { // Ensures uniformity. All should be .zip and NPM gives tar.gz
                zipContents(tempUnzippedFileDirectory, zipFileExtension, path.join(packagesDirectory, packageID)); 
            }
            else {
                await fs.promises.rename(tempFileZip, path.join(packagesDirectory, packageID));
            }
        }
        else {
            // Just move the existing zip to Data and rename to the ID.
            await fs.promises.rename(tempFileZip, path.join(packagesDirectory, packageID));
        }

        const returnBody: UploadInjestNewPackageResponseBody = {
            metadata: {
                Name: packageJson.name,
                Version: packageJson.version,
                ID: packageID,
            },
            //all fields are optional in data
            data: {},
        }
        res.status(200).json(returnBody);
    }
);
