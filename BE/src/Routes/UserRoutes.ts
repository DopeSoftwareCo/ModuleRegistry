/**
 * @author John Leidy
 * @description This module is responsible for creating the user routes and applying the necessary middelware to them.
 */
import { Router } from "express";
import { validateRequest } from "../Validation/validator";
import { userAddValidationRules } from "../Validation/UserValidationRules/userAdd";
import {
    addUserController,
    deleteUserController,
    updateUserController,
} from "../Controllers/UserControllers";
import { updateUserValidationRules } from "../Validation/UserValidationRules/userUpdate";
import { userDeleteValidationRules } from "../Validation/UserValidationRules/userDeleteValidationRules";
import { verifyToken } from "../Middleware/Auth";
import { checkManagementToken } from "../Middleware/ManagementToken";
import { permRestrictionMiddleware } from "../Middleware/PermRestrictor";
import { Restriction } from "./RoutePermissions";

export const UserRouter = Router();
// /adduser
// verifyToken is the userToken, checkManagementToken is for the management api
UserRouter.post(
    "/adduser",
    verifyToken,
    checkManagementToken,
    permRestrictionMiddleware(Restriction.Register),
    userAddValidationRules,
    validateRequest,
    addUserController
);
// /updateuser
UserRouter.post(
    "/updateuser",
    verifyToken,
    checkManagementToken,
    permRestrictionMiddleware(Restriction.Update),
    updateUserValidationRules,
    validateRequest,
    updateUserController
);
// /deleteuser
UserRouter.post(
    "/deleteuser",
    verifyToken,
    checkManagementToken,
    permRestrictionMiddleware(Restriction.DeleteUser),
    userDeleteValidationRules,
    validateRequest,
    deleteUserController
);
