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
    body("data").custom((data) => {
        const fields = ["Content", "URL", "JSProgram", "debloat"];
        const providedFields = fields.filter((field) => data?.hasOwnProperty(field));
        if (providedFields.length > 1) {
            throw new Error(InvalidUploadPackageMessage);
        }
        return true;
    }),
];
