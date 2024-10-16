import { header, param } from "express-validator";
import mongoose from "mongoose";

export const isMongoDbID = (_id: any) => mongoose.Types.ObjectId.isValid(_id);

const invalidByIdMessage =
    "There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.";

export const GeneralViaIDRuleset = [
    param("id")
        .exists()
        .withMessage(invalidByIdMessage)
        .isString()
        .withMessage(invalidByIdMessage)
        .custom(isMongoDbID)
        .withMessage(invalidByIdMessage),
    header("Authorization").exists().withMessage(invalidByIdMessage),
];
