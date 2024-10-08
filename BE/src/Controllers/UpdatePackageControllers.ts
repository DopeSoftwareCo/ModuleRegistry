import { UpdatePackageContentRequest } from "RequestTypes";
import asyncHandler from "../Middleware/asyncHandler";
import { UpdatePackageViaIDResponse, UpdatePackageViaIDResponseMessages } from "ResponseTypes";
import { NextFunction } from "express";
// /package/{id}
export const UpdatePackageViaIDController = asyncHandler(
    async (req: UpdatePackageContentRequest, res: UpdatePackageViaIDResponse, next: NextFunction) => {
        //the id requested
        const packageIDToUpdate = req.params.id;
        //the body with the data to use for update, find the type associated to see what fields the user can give us for updating
        const newData = req.body;
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
