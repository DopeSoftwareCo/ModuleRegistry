/**
 * @author John Leidy
 * @description This module is responsible for creating the test routes and applying the necessary middelware to them.
 * This ensures when a request object reaches a controller it is properly formatted, the user is authenticated, and all data that is needed is present.
 */
import { Router } from "express";
import { validateRequest } from "../Validation/validator";
import { TestValidationRules } from "../Validation/TestValidationRules/testReq";
import { TestController } from "../Controllers/testController/testController";

export const testRouter = Router();

testRouter.post("/", TestValidationRules, validateRequest, TestController);
