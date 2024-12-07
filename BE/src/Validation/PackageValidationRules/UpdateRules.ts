import { body, param } from "express-validator";

const InvalidUploadPackageMessage =
    "There is missing field(s) in the PackageID or it is formed improperly, or is invalid.";

export const UpdatePackageRules = [
    param("id")
        .exists()
        .withMessage("Package does not exist.")
        .isMongoId()
        .withMessage("Package does not exist."),
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
];
