import { UpdatePackageContentRequest } from "RequestTypes";
import asyncHandler from "../Middleware/asyncHandler";
import { UpdatePackageViaIDResponse, UpdatePackageViaIDResponseMessages } from "ResponseTypes";
import { NextFunction } from "express";
// /package/{id}
export const UpdatePackageViaIDController = asyncHandler(
    async (req: UpdatePackageContentRequest, res: UpdatePackageViaIDResponse, next: NextFunction) => {
        const packageIDToUpdate = req.params.id;
        //your code here

        //^^^^^^^^^^^^^^
        //something to signify the package didnt exist
        const DNE = false;
        let responseMesasge: UpdatePackageViaIDResponseMessages;

        if (!DNE) {
            responseMesasge = "Version is updated.";
            res.status(200).send(responseMesasge);
        } else {
            responseMesasge = "Package does not exist.";
            res.status(404).send(responseMesasge);
        }
    }
);
