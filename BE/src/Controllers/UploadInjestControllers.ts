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

// /packages
export const UploadInjestController = asyncHandler(
    async (req: UploadInjestPackageRequest, res: UploadInjestNewPackageResponse, next: NextFunction) => {
        //hover for custom typed body
        const body = req.body;
        PackageModel.findOne(body);
        //use the body data for your code here
        //must calculate all metrics here
        //store everything in db using package model

        // Given the URL, calculate both cost function values. In the GetPackageController,
        // I will look at the request and only display one of them if they don't want deps.
        if (body.URL) {
            const standaloneCost = await CalculateStandaloneCost(body.URL); // No deps
            const totalCost = await CalculateTotalCost(body.URL); //With deps
        }

        //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

        //will need some return that signifies package exists already
        const existsAlready = false;

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
        let responseMessage: UploadInjestResponseMessages;
        if (!existsAlready && !disqualified) {
            res.status(200).json(returnBody);
        } else if (existsAlready) {
            responseMessage = "Package exists already.";
            res.status(409).send(responseMessage);
        } else if (disqualified) {
            responseMessage = "Package is not uploaded due to disqualified rating.";
            res.status(424).send(responseMessage);
        }
    }
);
