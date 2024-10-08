import { GetPackagesRequest, GetPackageViaIdRequest } from "RequestTypes";
import asyncHandler from "../Middleware/asyncHandler";
import {
    GetPackagesInvalidResponseMessages,
    GetPackagesResponse,
    GetPackagesResponseBody,
    GetPackageViaIDInvalidResponseMessages,
    GetPackageViaIDResponse,
    GetPackageViaIDResponseBody,
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
// /package/{id}
export const GetPackageViaIDController = asyncHandler(
    async (req: GetPackageViaIdRequest, res: GetPackageViaIDResponse, next: NextFunction) => {
        const requestedPackageID = req.params.id;

        //your code here using the id

        //^^^^^^^^^^^^^^^^^^^^^^^^^^
        //return back something that signifies it was not found if that is the case;
        const DNE = false;
        //should return back here something typed as follows
        const responseBody: GetPackageViaIDResponseBody = {
            metadata: {
                Name: "package name",
                Version: "version",
                ID: "id",
            },
            //data is a partial... so we can leave it empty as such if necessary, shouldnt be as we return a 404 if the package does not exist.
            data: {},
        };
        let responseMessage: GetPackageViaIDInvalidResponseMessages;
        if (!DNE) {
            res.status(200).json(responseBody);
        } else {
            responseMessage = "Package does not exist.";
            res.status(404).send(responseMessage);
        }
    }
);
