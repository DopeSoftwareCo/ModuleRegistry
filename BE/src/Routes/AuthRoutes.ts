import { Router } from "express";
import { Authcontroller } from "../Controllers/AuthController";
import { AuthenticationRules } from "../Validation/AuthRules/AuthRules";
import { validateRequest } from "../Validation/validator";

export const AuthRouter = Router();
// /authenticate
AuthRouter.put("/", AuthenticationRules, validateRequest, Authcontroller);
