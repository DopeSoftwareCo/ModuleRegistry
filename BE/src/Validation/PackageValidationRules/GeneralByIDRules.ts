/**
 * @author John Leidy
 * @description This ensures the id field is proper and a valid mongodb id
 */
import { header, param } from "express-validator";
import mongoose from "mongoose";

export const isMongoDbID = (_id: any) => mongoose.Types.ObjectId.isValid(_id);

const invalidByIdMessage =
    "There is missing field(s) in the PackageID or it is formed improperly, or is invalid.";

export const GeneralViaIDRuleset = [
    param("id")
        .exists()
        .withMessage(invalidByIdMessage)
        .isString()
        .withMessage(invalidByIdMessage)
        .custom(isMongoDbID)
        .withMessage(invalidByIdMessage),
];
