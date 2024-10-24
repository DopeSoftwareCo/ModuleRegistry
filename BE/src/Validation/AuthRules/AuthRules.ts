/**
 * @author John Leidy
 * @description Validation rules for authentication. This verifies based on the body to ensure the request is proper.
 */
import { body } from "express-validator";

const InvalidAuthReqMessage =
    "There are missing field(s) in the AuthenticationRequest or it is formed improperly.";

export const AuthenticationRules = [
    body("User").exists().withMessage(InvalidAuthReqMessage).isObject().withMessage(InvalidAuthReqMessage),
    body("User.name")
        .exists()
        .withMessage(InvalidAuthReqMessage)
        .isString()
        .withMessage(InvalidAuthReqMessage),
    body("User.isAdmin")
        .exists()
        .withMessage(InvalidAuthReqMessage)
        .isBoolean()
        .withMessage(InvalidAuthReqMessage),
    body("Secret").exists().isObject().withMessage(InvalidAuthReqMessage).withMessage(InvalidAuthReqMessage),
    body("Secret.password")
        .exists()
        .withMessage(InvalidAuthReqMessage)
        .isString()
        .withMessage(InvalidAuthReqMessage),
];
