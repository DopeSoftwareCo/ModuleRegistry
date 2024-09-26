import { Router } from "express";
import { validateRequest } from "../Validation/validator";
import { TestValidationRules } from "../Validation/TestValidationRules/testReq";
import { TestController } from "../Controllers/testController/testController";

export const testRouter = Router();

testRouter.post("/", TestValidationRules, validateRequest, TestController);
