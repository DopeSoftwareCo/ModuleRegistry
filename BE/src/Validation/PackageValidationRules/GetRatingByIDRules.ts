/**
 * @author John Leidy
 * @description This ensures the id field is proper and a valid mongodb id, some response messages were different
 */
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
