import { DeleteAllVersionsByNameRequest, DeletePackageByIDRequest, ResetRegistryRequest } from "RequestTypes";
import asyncHandler from "../Middleware/asyncHandler";
import {
    DeletePackageByNameResponse,
    DeletePackageByNameResponseMessages,
    DeletePackageViaIDResponse,
    DeletePackageViaIDResponseMessages,
    ResetRegistryResponse,
    ResetRegistryResponseMessages,
} from "ResponseTypes";
import { NextFunction } from "express";
import PackageModel, { Package } from "../Schemas/Package";
import { Auth0_Database } from "../Providers/Auth0/Auth0_DB";

// /reset

export const ResetControllerDANGER = asyncHandler(
    async (req: ResetRegistryRequest, res: ResetRegistryResponse, next: NextFunction) => {
        const result = await Auth0_Database.RESET();

        let responseMessage: ResetRegistryResponseMessages;
        if (result) {
            responseMessage = "You do not have permission to reset the registry.";
            res.status(401).send(responseMessage);
        } else {
            // This will send a success message EVEN IF bad input is given.
            responseMessage = "Registry is reset.";
            res.status(200).send(responseMessage);
        }
    }
);

// /package/{id}
export const DeletePackageByIDController = asyncHandler(
    async (req: DeletePackageByIDRequest, res: DeletePackageViaIDResponse, next: NextFunction) => {
        const packageID = req.params.id;

        const result = await PackageModel.findByIdAndDelete<Package>(packageID);
        const DNE: boolean = result != null && result.errors == undefined;

        let responseMessage: DeletePackageViaIDResponseMessages;
        if (!DNE) {
            responseMessage = "Package is deleted.";
            res.status(200).send(responseMessage);
        } else {
            responseMessage = "Package does not exist.";
            res.status(404).send(responseMessage);
        }
    }
);

// /package/byName/{name} can add back if we swap to this route, or delete if desired we are on auth track instead...
// export const DeletePackageByNameController = asyncHandler(
//     async (req: DeleteAllVersionsByNameRequest, res: DeletePackageByNameResponse, next: NextFunction) => {
//         const packageName = req.params.name;
//         //use name to delete
//         //your code here

//         //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//         //something that signifies the package does not exist
//         const DNE = false;
//         let responseMessage: DeletePackageByNameResponseMessages;
//         if (!DNE) {
//             responseMessage = "Package is deleted.";
//             res.status(200).send(responseMessage);
//         } else {
//             responseMessage = "Package does not exist.";
//             res.status(404).send(responseMessage);
//         }
//     }
// );
