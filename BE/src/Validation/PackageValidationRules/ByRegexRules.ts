import { body, header } from "express-validator";

const InvalidReqMessageRegex =
    "There is missing field(S) in the PackageRegEx/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.";

export const ByRegexRules = [
    body("RegEx").exists().withMessage(InvalidReqMessageRegex).isString().withMessage(InvalidReqMessageRegex),
    header("Authorization")
        .exists()
        .withMessage(InvalidReqMessageRegex)
        .isString()
        .withMessage(InvalidReqMessageRegex),
];
