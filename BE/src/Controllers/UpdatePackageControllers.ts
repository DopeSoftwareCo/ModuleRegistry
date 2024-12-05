import { UpdatePackageContentRequest } from "RequestTypes";
import asyncHandler from "../Middleware/asyncHandler";
import { UpdatePackageViaIDResponse, UpdatePackageViaIDResponseMessages } from "ResponseTypes";
import { NextFunction } from "express";
import PackageModel from "../Schemas/Package";
import * as fs from "fs";
import * as path from "path";
import { debloatZippedContent } from "../Services/Packages/PackageZipHandling";

// /package/{id}cle
export const UpdatePackageViaIDController = asyncHandler(
    async (req: UpdatePackageContentRequest, res: UpdatePackageViaIDResponse, next: NextFunction) => {
        //the id requested
        const packageIDToUpdate = req.requestedId;
        //the body with the data to use for update, find the type associated to see what fields the user can give us for updating
        const newData = req.body;

        const pack = await PackageModel.findById(packageIDToUpdate);

        let responseMessage: UpdatePackageViaIDResponseMessages;

        if (pack?.metadata.Name == undefined) {
            responseMessage = "Package does not exist.";
            console.log(`/pacakge/{id} : ${responseMessage}`);
            res.status(404).send(responseMessage);
            return;
        }

        const body = req.body;
        let content = body.data.Content;
        let binaryContent; // Meant to store the non-string encoded version

        const packagesDirectory = path.join(process.cwd(), "Data/Packages");
        const tempDirectory = packagesDirectory + "/.Temp";
        const tempFile = path.join(tempDirectory, packageIDToUpdate!) + ".zip";

        if (!fs.existsSync(tempDirectory)) {
            // This is where data is downloaded before being examined.
            fs.mkdirSync(tempDirectory);
        } else {
            fs.rmSync(tempDirectory, { recursive: true, force: true });
            fs.mkdirSync(tempDirectory);
        }

        if (content != undefined) {
            const base64Data = content.split(",")[1]; // Remove the file header
            binaryContent = Buffer.from(base64Data, "base64");
        } else {
            responseMessage =
                "There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.";
            console.log(`/pacakge/{id} : ${responseMessage}`);
            res.status(424).send(responseMessage);
            return;
        }

        if (newData.metadata.Name == "no name" || newData.metadata.Version == "no version") {
            responseMessage =
                "There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.";
            console.log(`/pacakge/{id} : ${responseMessage}`);
            res.status(424).send(responseMessage);
            return;
        }

        await fs.promises.writeFile(tempFile, binaryContent);

        if (body.data.debloat == true) {
            await debloatZippedContent(tempFile);
        }

        // Save to database
        pack!.repoUrl = newData.data.URL!;
        pack!.metadata.Name = newData.metadata.Name;
        pack!.metadata.Version = newData.metadata.Version;
        pack!.save();

        // Save file
        await fs.promises.rename(tempFile, path.join(packagesDirectory, packageIDToUpdate!) + ".zip");

        responseMessage = "Version is updated.";
        console.log(`/pacakge/{id} : ${responseMessage}`);
        res.status(200).send(responseMessage);
    }
);
