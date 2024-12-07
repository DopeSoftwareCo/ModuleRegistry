import { NextFunction, Request, Response } from "express";
import { isMongoDbID } from "../Validation/PackageValidationRules/GeneralByIDRules";

/**
 * @author John Leidy
 * @description This function ensures the id given is a valid mongodb id (may be redundant).
 * If it is this is then appended to the request object for use in the controller.
 * @param req The express request object being passed down the chain
 * @param res The express response objecte being passed down the chain
 * @param next The exprss next function being passed down the chain
 * @returns
 */
export const appendMongoDBid = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!isMongoDbID(id)) {
        return res.status(404).send("Package does not exist.");
    }
    req.requestedId = id;
    next();
};
