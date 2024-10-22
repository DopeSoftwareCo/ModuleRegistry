/**
 * @author John Leidy
 * @description This ensures that the id is proper.
 * It also uses a custom function that ensures the ID provided is indeed a valid mongodb id.
 * Note: this does not ensure the requested ID exists in the databse.
 */
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
