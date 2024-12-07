import { body } from "express-validator";

const InvalidUploadPackageMessage =
    "There is missing field(s) in the PackageID or it is formed improperly, or is invalid.";

export const UpdatePackageRules = [
    body("metadata").exists().withMessage(InvalidUploadPackageMessage),
    body("metadata.Name")
        .exists()
        .withMessage(InvalidUploadPackageMessage)
        .isString()
        .withMessage(InvalidUploadPackageMessage),
    body("metadata.Version")
        .exists()
        .withMessage(InvalidUploadPackageMessage)
        .isString()
        .withMessage(InvalidUploadPackageMessage),
    body("metadata.ID")
        .exists()
        .withMessage(InvalidUploadPackageMessage)
        .isString()
        .withMessage(InvalidUploadPackageMessage),
    body("data")
        .exists()
        .withMessage(InvalidUploadPackageMessage)
        .isObject()
        .withMessage(InvalidUploadPackageMessage),
    body("data").custom((value) => {
        if (typeof value === "object") {
            console.log("Data is an object, ensuring only proper keys.");
            const keys = Object.keys(value);
            const validKeys = ["Content", "URL", "debloat", "JSProgram"];
            keys.forEach((key) => {
                if (!validKeys.includes(key)) {
                    throw Error(InvalidUploadPackageMessage);
                }
            });
        }
        return true;
    }),
];
