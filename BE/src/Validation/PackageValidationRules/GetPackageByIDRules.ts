/**
 * @author John Leidy
 * @description This ensures the id field is proper and a valid mongodb id, some response messages were slightly different
 */
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
