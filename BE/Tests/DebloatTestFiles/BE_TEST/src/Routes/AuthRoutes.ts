/**
 * @author John Leidy
 * @description This module is responsible for creating the auth routes and applying the necessary middelware to them.
 * This ensures when a request object reaches a controller it is properly formatted, the user is authenticated, and all data that is needed is present.
 */
import { Router } from "express";
import { Authcontroller } from "../Controllers/AuthController";
import { AuthenticationRules } from "../Validation/AuthRules/AuthRules";
import { validateRequest } from "../Validation/validator";

export const AuthRouter = Router();
// /authenticate
AuthRouter.put("/", AuthenticationRules, validateRequest, Authcontroller);
