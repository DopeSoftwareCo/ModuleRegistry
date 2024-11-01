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

export const UserRouter = Router();
// /adduser
UserRouter.post("/adduser", verifyToken, userAddValidationRules, validateRequest, addUserController);
// /updateuser
UserRouter.post("/updateuser", verifyToken, updateUserValidationRules, validateRequest, updateUserController);
// /deleteuser
UserRouter.post("/deleteuser", verifyToken, userDeleteValidationRules, validateRequest, deleteUserController);
