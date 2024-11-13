import { body } from "express-validator";

export const userDeleteValidationRules = [
    body("id").exists().withMessage("id must be a string.").isString().withMessage("id must be a string."),
    body("username")
        .exists()
        .withMessage("username must be a string")
        .isString()
        .withMessage("username must be a string"),
    body("email")
        .exists()
        .withMessage("email must be a string")
        .isString()
        .withMessage("email must be a string"),
];
