import { ResetRegistryRequest } from "RequestTypes";
import asyncHandler from "../Middleware/asyncHandler";
import {
    ResetRegistryResponse,
    ResetRegistryResponseMessages,
    UploadInjestNewPackageResponseBody,
    UploadInjestResponseMessages,
} from "ResponseTypes";
import { NextFunction } from "express";

export const ResetControllerDANGER = asyncHandler(
    (req: ResetRegistryRequest, res: ResetRegistryResponse, next: NextFunction) => {
        //your code here

        //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

        //will need something that signifies a user does not have permission
        const noPerms = false;
        //this type is a union of our return strings
        let responseMessage: ResetRegistryResponseMessages;
        if (!noPerms) {
            responseMessage = "Registry is reset.";
            res.status(200).send(responseMessage);
        } else {
            responseMessage = "You do not have permission to reset the registry.";
            res.status(401).send(responseMessage);
        }
    }
);
