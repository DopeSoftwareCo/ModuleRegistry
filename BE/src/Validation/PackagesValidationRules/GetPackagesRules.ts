import { body, CustomValidator, header } from "express-validator";

const InvalidGetPackagesMessage =
    "There is missing field(s) in the PackageQuery/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.";

export const hasVersionObject = (): CustomValidator => {
    console.log("hello");
    return (value) => {
        console.log("validating", value);
        if (!Array.isArray(value)) {
            console.log("failing not array");
            throw new Error(InvalidGetPackagesMessage);
        }
        for (const item of value) {
            console.log("item to validate in value", item);
            // Check if each item is an object
            if (typeof item !== "object" || item === null) {
                console.log("failing due to item not being object");
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
