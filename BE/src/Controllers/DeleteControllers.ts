import {
    DeleteAllVersionsByNameRequest,
    DeletePackageByIDRequest,
    ResetRegistryRequest,
    SystemResetRequest,
} from "RequestTypes";
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
import { User } from "../Classes/Users/User";
import { Permission, Role } from "../Classes/Users/subdir.const";
import { returnProperInvalidResponse } from "../Middleware/Auth";
// /reset

export const ResetControllerDANGER = asyncHandler(
    async (req: SystemResetRequest, res: ResetRegistryResponse, next: NextFunction) => {
        const perm = req.body.permission;
        const role = req.body.role;

        const result = await User.ClearRegistry.Execute(perm, role);
        const unathorized = result.failedToAuthorize;

        //this type is a union of our return strings
        let responseMessage: ResetRegistryResponseMessages;
        if (unathorized) {
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
        const perm = Permission._000;
        const role = Role.Unknown;

        const result = await User.RemoveFromRegistry.Execute(perm, role, packageID);
        if (result.failedToAuthorize) {
            return returnProperInvalidResponse;
        }

        let responseMessage: DeletePackageViaIDResponseMessages;
        const DNE = result.returnVal;

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
