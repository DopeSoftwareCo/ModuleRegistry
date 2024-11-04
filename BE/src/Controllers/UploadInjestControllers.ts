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
import { debloatUploadedContent } from "../DSinc_Modules/DSinc_PackageHandling";
import fs from 'fs';
import axios from 'axios';
import path from 'path';
import unzipper, { Entry } from 'unzipper'
import { ModuleEvaluator } from "../Providers/ModEval/ModuleEvaluator";
import { DEFAULT_WEIGHTS } from "../Providers/ModEval/RepoComponents/Metrics_Scores/Weightspec.const";
import { SuperRepoBuilder } from "../Providers/ModEval/RepoComponents/Builders/SuperRepoBuilder";


export const UploadInjestController = asyncHandler(
    async (req: UploadInjestPackageRequest, res: UploadInjestNewPackageResponse, next: NextFunction) => {
        const body = req.body; 
        let repositoryUrl = body.URL;
        let content = body.Content;
        let binaryContent; // Meant to store the non-string encoded version
        let getRepoURL = false;

        const disqualifiedStandaloneSizeInGB = 750 // Approximately 1GB
        const disqualifiedTotalSizeInGB = 1000 // Approximately 1GB
        const packagesDirectory = process.cwd() + "/Data/Packages";
        const tempDirectory = packagesDirectory + "/.Temp"
        const tempIDCeiling = 1000;
        const tempID = (Math.floor((Math.random() * tempIDCeiling) + 1)).toString();
        const tempFile = path.join(tempDirectory, tempID)
        const tempUnzippedFileDirectory = path.join(tempDirectory, tempID);
        if (!fs.existsSync(tempDirectory)) { // This is where data is downloaded before being examined. 
            fs.mkdirSync(tempDirectory);
        }
        else {
            //fs.rmSync(tempDirectory, { recursive: true, force: true})
            //fs.mkdirSync(tempDirectory);
        }

        let responseMessage: UploadInjestResponseMessages;

        if (repositoryUrl == undefined && content != undefined) {
            // Confirmed that content exists, decode and extract repository URL.
            binaryContent = Buffer.from(content, "base64");
            repositoryUrl = repositoryUrl as unknown as string; // Type casts it from "string | undefined" to "string"
            getRepoURL = true;
        }
        else if (content == undefined && repositoryUrl != undefined) {
            // Confirmed that the repoURL exists, download content
            const response = await axios.get(repositoryUrl,{ responseType: 'arraybuffer' });
            binaryContent = Buffer.from(response.data, 'binary');
        }
        else {
            responseMessage = "There is missing field(s) in the PackageData or it is formed improperly (e.g. Content and URL are both set)";
            res.status(424).send(responseMessage);
            return;
        }

        fs.promises.writeFile(tempFile, binaryContent);

        // Unzip and get the packageJson
        const zipStream = unzipper.Parse();
        zipStream.on('entry', async (entry: Entry) => {
            const individualFilePath = path.join(tempUnzippedFileDirectory, entry.path);
            const writeStream = fs.createWriteStream(individualFilePath);
            entry.pipe(writeStream);
        });
        const packageJsonFile = await fs.promises.readFile(path.join(tempUnzippedFileDirectory, 'package.json'), 'utf-8');
        const packageJson = JSON.parse(packageJsonFile);

        let startingPointJS = packageJson.scripts.start;
        

        if (getRepoURL) {
            repositoryUrl = packageJson.homepage as string;
        }

        // Checks if exists
        const queriedPackage = PackageModel.findOne({ repoUrl: repositoryUrl})
        if (queriedPackage != null) {
            responseMessage = "Package exists already.";
            res.status(409).send(responseMessage);
        }
        else { // Checks if Disqualified
            const standaloneCost = await CalculateStandaloneCost(repositoryUrl); // No deps
            const totalCost = await CalculateTotalCost(repositoryUrl); // With deps
            if (totalCost > disqualifiedTotalSizeInGB || standaloneCost > disqualifiedStandaloneSizeInGB) {
                responseMessage = "Package is not uploaded due to disqualified rating.";
                res.status(424).send(responseMessage);
            }
        }

        const evaluator = new ModuleEvaluator(DEFAULT_WEIGHTS);
        const repoBuilder = new SuperRepoBuilder();
        const repository = await repoBuilder.SuperBuild(repositoryUrl);
        if (repository == undefined) {
            responseMessage = "Package is not uploaded due to disqualified rating.";
            res.status(424).send(responseMessage);
            return;
        }
        const score = await evaluator.Eval(repository);


        const package = new PackageModel(); // Placeholder
        const savedpackage = await package.save(); // Placeholder
        const packageID = savedpackage._id.toString()

        if (body.debloat == true) {
            binaryContent = await debloatUploadedContent(binaryContent.toString('binary')); // Placeholder
            // Zip up, and store
        }
        else {
            // Just move the existing zip to Data and rename to the ID.
        }

        // PackageModel.create(); // Need to get ID from this
        const returnBody: UploadInjestNewPackageResponseBody = {
            metadata: {
                Name: packageJson.name,
                Version: packageJson.version,
                ID: packageID,
            },
            //all fields are optional in data
            data: {},
        }
        
        //store everything in db using package model

        // A URL will need to be obtained to run Evaluator and other scoring functions.
        // The uploadInjest request will either have URL or Content (base64 string encoded), but never both.
        // If we get Content, then the package will need to be saved and parsed to find the required values (URLs only afaik)
        // If we get URL, the package will need to be downloaded, but the URL can be used for all scoring.
        // John is open to questions if you require more information about this.


        //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    }
);
