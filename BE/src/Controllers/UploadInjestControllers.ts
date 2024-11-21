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

        if (repositoryUrl == undefined && content != undefined) {
            // Confirmed that content exists, decode and extract repository URL.
            const base64Data = content.split(",")[1];
            binaryContent = Buffer.from(base64Data, "base64");
            repositoryUrl = repositoryUrl as unknown as string; // Type casts it from "string | undefined" to "string"
            getRepoURL = true;
        }
        else if (content == undefined && repositoryUrl != undefined) {
            // Confirmed that the repoURL exists, download content
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
        const packageJsonFile = await fs.promises.readFile(path.join(tempUnzippedFileDirectory, "placeholder-main/package.json"), 'utf-8');
        const packageJson = JSON.parse(packageJsonFile.toString());
        //ENOENT: no such file or directory, open '/mnt/Shared/Shared Drive/School/Software Engineering/Homework/Phase 2/BE/Data/Packages/.Temp/357/ModuleRegistry-dev/package.json'

        if (getRepoURL) {
            repositoryUrl = packageJson.repository.url as string;
        }

        // Checks if exists
        const queriedPackage = await PackageModel.exists({ repoUrl: repositoryUrl})
        if (queriedPackage !== null) {
            console.log(queriedPackage);
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
        const builder = new SuperRepoBuilder(DEFAULT_WEIGHTS);
        let row;
        const repoForEval = await builder.SuperBuild(repositoryUrl ? repositoryUrl : "");
        if (repoForEval && repositoryUrl) {
            await evaluator.Eval(repoForEval);
            row = repoForEval.NDJSONRow;
        }

        // Add values to database here
        
        const packageReference = new PackageModel({
            Title: packageJson.name,
            repoURL: packageJson.repository.url,
            metadata: {
                Name: packageJson.name,
                Version: packageJson.version,
                License: {
                    name: packageJson.license
                },
                Uploader: packageJson.author,
                IsExternal: isExternal, 
                Safety: "unsafe", // Default Value, Do Not See a way to determine this
                IsSecret: false, // Default
                Visibility: "public", // Default
                Availability: 100, // Default
                PrivelegedGroup: 100 // Default
            },
            data: {
                Content: "PLACEHOLDER", // Since we are not storing content in database
                JSProgram: "PLACEHOLDER"
            }, // All Zeros Below are placeholders
            RampupTime: {
                rampup_score: 0,
                rampup_score_latency: 0,
            },
            Correctness: {
                score_correctness: 0,
                score_correctness_latency: 0,
            },
            BusFactor: {
                score_busFactor: 0,
                score_busFactor_latency: 0,
            },
            Responsiveness: {
                score_responsiveMaintainer: 0,
                score_responsiveMaintainer_latency: 0,
            },
            LicenseCompatibility: {
                score_license: 0,
                score_license_latency: 0,
            },
            VersionDependence: {
                score_versionDependence: 0,
                score_versionDependence_latency: 0,
            },
            MergeRestriction: {
                score_mergeRestriction: 0,
                score_mergeRestriction_latency: 0,
            },
            IndividualSizeCost: {
                score_sizeCostStandalone: 0,
                score_sizeCostStandalone_latency: 0,
            },
            TotalSizeCost: {
                score_sizeCostTotal: 0,
                score_sizeCostTotal_latency: 0,
            },
            GoodPinningPractice: {
                score_goodPinningPractice: 0,
                score_goodPinningPracticeLatency: 0,
            },
            PullRequest: {
                score_pullRequest: 0,
                score_pullRequestLatency: 0,
            },
            FinalRating: {
                netscore: 0,
                netscore_latency: 0,
            },
        }); 
        const savedpackage = await packageReference.save();
        const packageID = savedpackage._id.toString()

        if (body.debloat == true) {
            // Zip up, and store
            binaryContent = await debloatUploadedContent(binaryContent.toString('binary')); // Placeholder
            const zippedContentStream = fs.createWriteStream(path.join(packagesDirectory, packageID));
            const archive = archiver("zip", { zlib: { level: 9 } });
            archive.pipe(zippedContentStream);
            archive.append(binaryContent);
            archive.finalize();
        }
        else {
            // Just move the existing zip to Data and rename to the ID.
            await fs.promises.copyFile(tempFileZip, path.join(packagesDirectory, packageID));
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
        fs.rmSync(tempDirectory, { recursive: true, force: true})
        res.status(200).json(returnBody);
    }
);
