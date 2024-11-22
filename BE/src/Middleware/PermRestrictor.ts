import { NextFunction, Request, Response } from "express";
import { returnProperInvalidResponse } from "./Auth";
import { PermissionEnum, Role } from "../Classes/Users/subdir.const";

const hasProperRole = (userRole: Role, requiredRoles: Role[]) =>
    requiredRoles.length === 0 || requiredRoles.includes(userRole);

const hasProperPermission = (userPermission: PermissionEnum, requiredPermissions: PermissionEnum[]) =>
    requiredPermissions.length === 0 || requiredPermissions.includes(userPermission);

/**
 * @author John Leidy
 * @param requiredPermissions
 * @param requiredRoles
 * @returns the next function in the chain {@type NextFunction}
 */
export const permRestrictionMiddleware = (requiredPermissions: PermissionEnum[], requiredRoles: Role[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (process.env.NODE_ENV !== "dev") {
            if (!req.decodedToken) {
                return returnProperInvalidResponse(req, res);
            }

            if (
                !hasProperRole(req.decodedToken.metadata.role, requiredRoles) ||
                !hasProperPermission(req.decodedToken.metadata.permission, requiredPermissions)
            ) {
                return returnProperInvalidResponse(req, res);
            }
            return next();
        } else {
            return next();
        }
    };
};
