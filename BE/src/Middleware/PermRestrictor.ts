import { NextFunction, Request, Response } from "express";
import { returnProperInvalidResponse } from "./Auth";
import { Permission, Role } from "../Classes/Users/subdir.const";
import { RestrictedOperation } from "../Classes/PrivilegedOperations";

/**
 * @author John Leidy
 * @param requiredPermissions
 * @param requiredRoles
 * @returns the next function in the chain {@type NextFunction}
 */
export const permRestrictionMiddleware = (requiredPermissions: Permission[], requiredRoles?: Role[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (process.env.NODE_ENV !== "dev") {
            if (!req.decodedToken) {
                return returnProperInvalidResponse(req, res);
            }

            const restrictor = new RestrictedOperation(requiredPermissions, requiredRoles);
            const result = restrictor.Execute(req.decodedToken);

            if (!result) {
                return returnProperInvalidResponse(req, res);
            }
            return next();
        } else {
            return next();
        }
    };
};
