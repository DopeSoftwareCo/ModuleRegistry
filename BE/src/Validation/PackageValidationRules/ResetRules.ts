import { header } from "express-validator";

export const ResetRules = [
    header("Authorization")
        .exists()
        .isString()
        .withMessage(
            "There is missing field(s) in the AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid."
        ),
];
