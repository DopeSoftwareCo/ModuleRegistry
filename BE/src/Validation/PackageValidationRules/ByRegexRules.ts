/**
 * @author John Leidy
 * @description This module is responsible for validating the regular expression request.
 */
import { body, header } from "express-validator";

const InvalidReqMessageRegex =
    "There is missing field(s) in the PackageRegEx or it is formed improperly, or is invalid";

export const ByRegexRules = [
    body("RegEx").exists().withMessage(InvalidReqMessageRegex).isString().withMessage(InvalidReqMessageRegex),
];
