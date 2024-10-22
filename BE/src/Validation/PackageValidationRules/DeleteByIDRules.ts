import { param } from "express-validator";
import { isMongoDbID } from "./GeneralByIDRules";

const invalidDeleteByIDMessage = "There is missing field(s) in the PackageID or invalid";

export const DeleteByIDRules = [
    param("id")
        .exists()
        .withMessage(invalidDeleteByIDMessage)
        .isString()
        .withMessage(invalidDeleteByIDMessage)
        .custom(isMongoDbID)
        .withMessage(invalidDeleteByIDMessage),
];
