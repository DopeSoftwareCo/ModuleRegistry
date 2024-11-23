import { body } from "express-validator";

export const updateUserValidationRules = [
    body("id")
        .exists()
        .withMessage("id must exist to update user.")
        .isString()
        .withMessage("id must be a string.")
        .isLength({ min: 6 })
        .withMessage("invalid id"),
    body("permission").optional().isInt({ min: 0, max: 7 }).withMessage("Permission must be a value 0-7"),
    body("role").optional().isInt({ min: 0, max: 7 }).withMessage("Permission must be a value 0-3"),
];
