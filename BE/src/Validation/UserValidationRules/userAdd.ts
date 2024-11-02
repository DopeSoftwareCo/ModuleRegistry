import { body } from "express-validator";

export const userAddValidationRules = [
    body("username")
        .exists()
        .withMessage("username must be a string.")
        .isString()
        .withMessage("username must be a string."),
    body("email")
        .exists()
        .withMessage("email must be a string.")
        .isString()
        .withMessage("email must be a string."),
    body("password")
        .exists()
        .withMessage("password must be a string")
        .isString()
        .withMessage("password must be a string"),
];
