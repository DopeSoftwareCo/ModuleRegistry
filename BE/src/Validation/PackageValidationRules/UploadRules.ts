import { body, header } from "express-validator";

const InvalidUploadPackageMessage =
    "There is missing field(s) in the PackageData/AuthenticationToken or it is formed improperly (e.g. Content and URL are both set), or the AuthenticationToken is invalid.";

export const UploadPackageRules = [
    body("Content")
        .exists()
        .withMessage(InvalidUploadPackageMessage)
        .isString()
        .withMessage(InvalidUploadPackageMessage),
    body("JSProgram")
        .exists()
        .withMessage(InvalidUploadPackageMessage)
        .isString()
        .withMessage(InvalidUploadPackageMessage),
    header("Authorization")
        .exists()
        .withMessage(InvalidUploadPackageMessage)
        .isString()
        .withMessage(InvalidUploadPackageMessage),
];
