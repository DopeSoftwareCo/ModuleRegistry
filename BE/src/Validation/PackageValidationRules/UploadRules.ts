import { body, header } from "express-validator";

export const UploadPackageRules = [
    body("Content")
        .exists()
        .isString()
        .withMessage(
            "There is missing field(s) in the PackageData/AuthenticationToken or it is formed improperly (e.g. Content and URL are both set), or the AuthenticationToken is invalid."
        ),
    body("JSProgram")
        .exists()
        .isString()
        .withMessage(
            "There is missing field(s) in the PackageData/AuthenticationToken or it is formed improperly (e.g. Content and URL are both set), or the AuthenticationToken is invalid."
        ),
    header("Authorization")
        .exists()
        .isString()
        .withMessage(
            "There is missing field(s) in the PackageData/AuthenticationToken or it is formed improperly (e.g. Content and URL are both set), or the AuthenticationToken is invalid."
        ),
];
