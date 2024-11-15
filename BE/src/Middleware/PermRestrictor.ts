import { NextFunction, Request, Response } from "express";
import { returnProperInvalidResponse } from "./Auth";
import { Permission, Role } from "../Classes/Users/UserTypes";

export type RestrictionType = { perm: Permission[]; roles: Role[] | undefined };
/**
 * @author John Leidy
 * @param requiredPermissions
 * @param requiredRoles
 * @returns the next function in the chain {@type NextFunction}
 */
export const permRestrictionMiddleware = (restriction: RestrictionType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (process.env.NODE_ENV !== "dev") {
            if (!req.decodedToken) {
                return returnProperInvalidResponse(req, res);
            }

            const permission = req.userPermission ? req.userPermission : 0;
            const role = req.userRole ? req.userRole : 0;

            const validRole = restriction.roles ? restriction.roles.includes(role) : true;
            const authorize = restriction.perm.includes(permission) && validRole;

            if (!authorize) {
                return returnProperInvalidResponse(req, res);
            }
            return next();
        } else {
            return next();
        }
    };
};
