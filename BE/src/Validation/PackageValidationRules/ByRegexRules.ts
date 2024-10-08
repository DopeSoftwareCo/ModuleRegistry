import { body, header } from "express-validator";

export const ByRegexRules = [
    body("RegEx")
        .exists()
        .isString()
        .withMessage(
            "There is missing field(S) in the PackageRegEx/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid."
        ),
    header("Authorization")
        .exists()
        .isString()
        .withMessage(
            "There is missing field(S) in the PackageRegEx/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid."
        ),
];
