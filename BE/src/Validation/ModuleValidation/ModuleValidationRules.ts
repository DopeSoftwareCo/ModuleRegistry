import { body, CustomValidator } from "express-validator";
import { AddModuleRequest } from "RequestTypes";

const validateFields = (): CustomValidator => {
    return (value) => {
        console.log("in validate fields", value);
        if (value.url) {
            return true;
        }

        if (!value.repoName || !value.repoOwner) {
            throw new Error("repoOwner and repoName must exist together if the url field is not present.");
        }

        if (typeof value.repoName !== "string" || typeof value.repoOwner !== "string") {
            throw new Error("repoOwner and repoName must be strings");
        }

        return true;
    };
};

export const ModuleValidationRules = [
    body("url").optional().isString().withMessage("body field url must be a string."),
    body().custom(validateFields()),
];
