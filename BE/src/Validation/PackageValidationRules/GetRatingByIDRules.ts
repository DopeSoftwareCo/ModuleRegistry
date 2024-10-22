import { param } from "express-validator";
import { isMongoDbID } from "./GeneralByIDRules";

const invalidByIdMessage = "There is missing field(s) in the PackageID";
export const GetRatingByIdRules = [
    param("id")
        .exists()
        .withMessage(invalidByIdMessage)
        .isString()
        .withMessage(invalidByIdMessage)
        .custom(isMongoDbID)
        .withMessage(invalidByIdMessage),
];
