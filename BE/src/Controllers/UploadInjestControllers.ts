import { UploadInjestPackageRequest } from "RequestTypes";
import asyncHandler from "../Middleware/asyncHandler";
import {
    UploadInjestNewPackageResponse,
    UploadInjestNewPackageResponseBody,
    UploadInjestResponseMessages,
} from "ResponseTypes";
import { NextFunction } from "express";
import PackageModel from "../Schemas/Package";
import { ModuleEvaluator } from "../Providers/ModEval/ModuleEvaluator";
import { dummy_weightspecs } from "../Providers/ModEval/DevTools/DummyVals";
import { Repository } from "../Providers/ModEval/RepoComponents/Repository";
// /packages
export const UploadInjestController = asyncHandler(
    async (req: UploadInjestPackageRequest, res: UploadInjestNewPackageResponse, next: NextFunction) => {
        const body = req.body; 
        const url = body.URL;

        let responseMessage: UploadInjestResponseMessages;

        // Checks if exists
        const queriedPackage = PackageModel.findOne({ repoUrl: url})
        if (queriedPackage != null) {
            responseMessage = "Package exists already.";
            res.status(409).send(responseMessage);
        }

        // Checks if Disqualified
        const evaluator = new ModuleEvaluator(dummy_weightspecs[0]); // Needs to be updated with real weights
        /*evaluator.Eval(Repository {
            ,
        }) */

        //use the body data for your code here
        //must calculate all metrics here
        //store everything in db using package model

        //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

        //will need some return that signifies package exists already

        //will need some return that signifies package is not uploaded due to disqualified rating
        const disqualified = false;

        const returnBody: UploadInjestNewPackageResponseBody = {
            metadata: {
                Name: "some name",
                Version: "Some version",
                ID: "Some id",
            },
            //all fields are optional in data
            data: {},
        };
        //this type is a union of our return strings
        if (!disqualified) {
            res.status(200).json(returnBody);
        } else if (disqualified) {
            responseMessage = "Package is not uploaded due to disqualified rating.";
            res.status(424).send(responseMessage);
        }
    }
);
