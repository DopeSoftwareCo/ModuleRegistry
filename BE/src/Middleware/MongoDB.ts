import { NextFunction, Request, Response } from "express";
import { isMongoDbID } from "../Validation/PackageValidationRules/GeneralByIDRules";

export const appendMongoDBid = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!isMongoDbID(id)) {
        return res
            .status(400)
            .send(
                "There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid."
            );
    }
    req.requestedId = id;
    next();
};
