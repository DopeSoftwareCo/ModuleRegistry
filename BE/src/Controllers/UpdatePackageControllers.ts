import { UpdatePackageContentRequest } from "RequestTypes";
import asyncHandler from "../Middleware/asyncHandler";
import { UpdatePackageViaIDResponse, UpdatePackageViaIDResponseMessages } from "ResponseTypes";
import { NextFunction } from "express";
import PackageModel from "../Schemas/Package";

// /package/{id}
export const UpdatePackageViaIDController = asyncHandler(
    async (req: UpdatePackageContentRequest, res: UpdatePackageViaIDResponse, next: NextFunction) => {
        //the id requested
        const packageIDToUpdate = req.requestedId;
        //the body with the data to use for update, find the type associated to see what fields the user can give us for updating
        const newData = req.body;

        const pack = await PackageModel.findById(packageIDToUpdate);

        let DNE;

        if (pack) {
            pack.data.Content = newData.data.Content!;
            pack.data.JSProgram = newData.data.JSProgram!;
            pack.repoUrl = newData.data.URL!;
            pack.metaData = newData.metadata;
            pack.save();
            DNE = false;
        } else {
            DNE = true;
        }

        //something to signify the package didnt exist
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
