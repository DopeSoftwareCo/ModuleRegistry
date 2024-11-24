import { body } from "express-validator";

export const userDeleteValidationRules = [
    body("id")
        .exists()
        .withMessage("id must be a string.")
        .isString()
        .withMessage("id must be a string.")
        .isLength({ min: 6 })
        .withMessage("Invalid user ID"),
];
