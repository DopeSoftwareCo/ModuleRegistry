import { body, CustomValidator, header } from "express-validator";

const InvalidGetPackagesMessage =
    "There is missing field(s) in the PackageQuery or it is formed improperly, or is invalid.";

export const hasVersionObject = (): CustomValidator => {
    return (value) => {
        if (!Array.isArray(value)) {
            throw new Error(InvalidGetPackagesMessage);
        }
        for (const item of value) {
            // Check if each item is an object
            if (typeof item !== "object" || item === null) {
                throw new Error(InvalidGetPackagesMessage);
            }

            if (typeof item.Version !== "string" || item.Version === null) {
                throw new Error(InvalidGetPackagesMessage);
            }

            if (typeof item.Name !== "string" || item.Name === null) {
                throw new Error(InvalidGetPackagesMessage);
            }
        }

        return true;
    };
};

export const GetPackagesRules = [
    body().custom(hasVersionObject()),
    header("Authorization")
        .exists()
        .withMessage(InvalidGetPackagesMessage)
        .isString()
        .withMessage(InvalidGetPackagesMessage),
];
