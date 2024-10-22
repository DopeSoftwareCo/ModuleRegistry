import { param } from "express-validator";
import { isMongoDbID } from "./GeneralByIDRules";

const invalidByIdMessage =
    "There is missing field(s) in the PackageID or it is formed improperly, or is invalid.";

export const GetPackageByIDRules = [
    param("id")
        .exists()
        .withMessage(invalidByIdMessage)
        .isString()
        .withMessage(invalidByIdMessage)
        .custom(isMongoDbID)
        .withMessage(invalidByIdMessage),
];
