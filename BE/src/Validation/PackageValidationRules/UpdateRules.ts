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
    body("data.debloat").optional().isBoolean().withMessage(InvalidUploadPackageMessage),
    body("data.URL")
        .exists()
        .withMessage(InvalidUploadPackageMessage)
        .isString()
        .withMessage(InvalidUploadPackageMessage),
    body("data.Content")
        .exists()
        .withMessage(InvalidUploadPackageMessage)
        .isString()
        .withMessage(InvalidUploadPackageMessage),
    body("data.JSProgram")
        .exists()
        .withMessage(InvalidUploadPackageMessage)
        .isString()
        .withMessage(InvalidUploadPackageMessage),
];
