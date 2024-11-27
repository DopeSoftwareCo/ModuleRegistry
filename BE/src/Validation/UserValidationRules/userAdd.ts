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
    body("permission")
        .exists()
        .withMessage("Permission must be a value 0-7")
        .isInt({ min: 0, max: 7 })
        .withMessage("Permission must be a value 0-7"),
    body("role")
        .exists()
        .withMessage("Permission must be a value 0-7")
        .isInt({ min: 0, max: 7 })
        .withMessage("Permission must be a value 0-3"),
];
