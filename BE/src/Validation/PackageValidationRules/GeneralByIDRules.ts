import { header, param } from "express-validator";

export const GeneralViaIDRuleset = [
    param("id")
        .exists()
        .isString()
        .withMessage(
            "There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid."
        ),
    header("Authorization")
        .exists()
        .withMessage(
            "There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid."
        ),
];
