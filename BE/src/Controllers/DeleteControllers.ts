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
// /reset
export const ResetControllerDANGER = asyncHandler(
    async (req: ResetRegistryRequest, res: ResetRegistryResponse, next: NextFunction) => {
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
// /package/{id}
export const DeletePackageByIDController = asyncHandler(
    async (req: DeletePackageByIDRequest, res: DeletePackageViaIDResponse, next: NextFunction) => {
        const packageID = req.params.id;
        //use id to delete
        //your code here

        //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        //something that signifies it does not exist
        const DNE = false;
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
