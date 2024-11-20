import { UpdatePackageContentRequest } from "RequestTypes";
import asyncHandler from "../Middleware/asyncHandler";
import { UpdatePackageViaIDResponse, UpdatePackageViaIDResponseMessages } from "ResponseTypes";
import { NextFunction } from "express";
import PackageModel from "../Schemas/Package";
import * as fs from "fs";
import * as path from "path";
import { debloatZippedContent, debloatUploadedContent } from "../DSinc_Modules/DSinc_PackageHandling";

// /package/{id}
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
            res.status(404).send(responseMessage);
        }
        // console.log("VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV\n");
        // console.log(packageIDToUpdate);
        // console.log("\n");
        // console.log(pack?.metadata.Name);
        // console.log("\n");
        // console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");

        const body = req.body;
        let repositoryUrl = body?.data.URL;
        let content = body?.data.Content;
        let binaryContent; // Meant to store the non-string encoded version
        let getRepoURL = false;

        const archiver = require("archiver");
        const packagesDirectory = path.join(process.cwd(), "Data/Packages");
        const tempDirectory = packagesDirectory + "/.Temp";
        const tempFile = path.join(tempDirectory, packageIDToUpdate!);

        if (!fs.existsSync(tempDirectory)) {
            // This is where data is downloaded before being examined.
            fs.mkdirSync(tempDirectory);
        } else {
            fs.rmSync(tempDirectory, { recursive: true, force: true });
            fs.mkdirSync(tempDirectory);
        }

        if (content != undefined) {
            // Confirmed that content exists, decode and extract repository URL.
            binaryContent = Buffer.from(content, "base64");
            repositoryUrl = repositoryUrl as unknown as string; // Type casts it from "string | undefined" to "string"
            getRepoURL = true;
        } else {
            responseMessage =
                "There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.";
            res.status(424).send(responseMessage);
            return;
        }

        await fs.promises.writeFile(tempFile, binaryContent);

        if (body.data.debloat == true) {
            // Zip up, and store
            binaryContent = await debloatZippedContent(`${packagesDirectory}/${packageIDToUpdate}`); // Placeholder
            const zippedContentStream = fs.createWriteStream(
                path.join(packagesDirectory, packageIDToUpdate!)
            );
            const archive = archiver("zip", { zlib: { level: 9 } });
            archive.pipe(zippedContentStream);
            archive.append(binaryContent, { name: `${packagesDirectory}/${packageIDToUpdate}` });
            archive.finalize();
        } else {
            // Just move the existing zip to Data and rename to the ID.
            await fs.promises.copyFile(tempFile, path.join(packagesDirectory, packageIDToUpdate!));
        }

        // const returnBody: UpdatePackageViaIDResponse = {
        //     metadata: {
        //         Name: packageJson.name,
        //         Version: packageJson.version,
        //         ID: packageID,
        //     },
        //     //all fields are optional in data
        //     data: {},
        // }
        pack!.data.Content = newData.data.Content!;
        pack!.data.JSProgram = newData.data.JSProgram!;
        pack!.repoUrl = newData.data.URL!;
        pack!.metadata.Name = newData.metadata.Name;
        pack!.metadata.Version = newData.metadata.Version;
        pack!.save();

        //something to signify the package didnt exist
        // let responseMessage: UpdatePackageViaIDResponseMessages;

        fs.rmSync(tempDirectory, { recursive: true, force: true });
        responseMessage = "Version is updated.";
        res.status(200).send(responseMessage);
    }
);
