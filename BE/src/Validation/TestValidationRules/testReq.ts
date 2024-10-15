import { body } from "express-validator";

export const TestValidationRules = [body("test").isString().withMessage("body must have the field test and")];
