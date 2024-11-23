import { DeletePackageByIDRequest, SystemResetRequest } from "RequestTypes";
import asyncHandler from "../Middleware/asyncHandler";
import {
    DeletePackageViaIDResponse,
    DeletePackageViaIDResponseMessages,
    ResetRegistryResponse,
    ResetRegistryResponseMessages,
} from "ResponseTypes";
import { NextFunction } from "express";
import { ResetSystem } from "../Services/SystemReset";

// /reset
export const ResetControllerDANGER = asyncHandler(
    async (req: SystemResetRequest, res: ResetRegistryResponse, next: NextFunction) => {
        let responseMessage: ResetRegistryResponseMessages;
        if (!req.permission || !req.role) {
            //everyone will have some perm and some role
            responseMessage = "You do not have permission to reset the registry.";
            res.status(401).send(responseMessage);
            return;
        }

        let result: boolean = true;
        try {
            await ResetSystem();
        } catch {
            result = false;
        }

        //covering our bases here incase there is some weird failure, while not transparent to the user..
        //this type is a union of our return strings
        if (!result) {
            responseMessage = "You do not have permission to reset the registry.";
            res.status(401).send(responseMessage);
            return;
        } else {
            // This will send a success message EVEN IF bad input is given.
            responseMessage = "Registry is reset.";
            res.status(200).send(responseMessage);
            return;
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
