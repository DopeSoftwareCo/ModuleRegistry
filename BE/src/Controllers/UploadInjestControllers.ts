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
        if (!fs.existsSync(tempDirectory)) { // This is where data is downloaded before being examined. 
            fs.mkdirSync(tempDirectory);
        }
        else {
            fs.rmSync(tempDirectory, { recursive: true, force: true})
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

        if (getRepoURL) {
            repositoryUrl = "https://github.com/DopeSoftwareCo/ModuleRegistry"; // PLACEHOLDER, properly assigns it.
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
        if (body.debloat == true) {
            binaryContent = await debloatUploadedContent(binaryContent.toString('binary'));
        }

        // PackageModel.create(); // Need to get ID from this
        const returnBody: UploadInjestNewPackageResponseBody = {
            metadata: {
                Name: "Name",
                Version: "1.0.0", // Since this is an initial release
                ID: "Some id", // Pull from Package
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
