import { GetPackagesRequest, GetPackageViaIdRequest } from "RequestTypes";
import asyncHandler from "../Middleware/asyncHandler";
import {
    GetPackagesInvalidResponseMessages,
    GetPackagesResponse,
    GetPackagesResponseBody,
    GetPackageViaIDResponse,
} from "ResponseTypes";
import { NextFunction } from "express";

// /packages
export const GetPackagesFromRegistryController = asyncHandler(
    async (req: GetPackagesRequest, res: GetPackagesResponse, next: NextFunction) => {
        const requestedPackages = req.body;
        //hover to see types
        //your code here

        //^^^^^^^^^^^^^^^^
        //should return back to here a typed arr like this, this is metadata ab the package
        const responseBody: GetPackagesResponseBody = [
            { Version: "Some version", Name: "Some name", ID: "Some ID" },
        ];
        //something to signify too many packages were returned
        const tooManyreturned = false;
        let responseMessage: GetPackagesInvalidResponseMessages;
        if (!tooManyreturned) {
            res.status(200).json(responseBody);
        } else {
            responseMessage = "Too many packages returned.";
            res.status(413).send(responseMessage);
        }
    }
);

export const GetPackageViaIDController = asyncHandler(
    async (req: GetPackageViaIdRequest, res: GetPackageViaIDResponse, next: NextFunction) => {}
);
