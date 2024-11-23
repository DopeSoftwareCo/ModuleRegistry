import { body } from "express-validator";

export const updateUserValidationRules = [
    body("id")
        .exists()
        .withMessage("id must exist to update user.")
        .isString()
        .withMessage("id must be a string.")
        .isLength({ min: 6 })
        .withMessage("invalid id"),
];
