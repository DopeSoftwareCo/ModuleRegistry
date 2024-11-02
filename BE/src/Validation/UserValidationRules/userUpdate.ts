import { body } from "express-validator";

export const updateUserValidationRules = [
    body("permissions")
        .custom((value) => {
            if (!Array.isArray(value)) {
                throw new Error("Permissions must be an array.");
            }
            return true;
        })
        .withMessage("permissions should be an array."),
];
