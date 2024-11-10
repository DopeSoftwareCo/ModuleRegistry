import { NextFunction, Request, Response } from "express";
import { returnProperInvalidResponse } from "./Auth";
import { Permission, Role } from "../Classes/Users/subdir.const";
import { OpUnderRestriction } from "../Classes/Ops-Under-Restriction/OpUnderRestriction";
import { Restricted_Return } from "../Classes/Ops-Under-Restriction/subdir.types";

/**
 * @author John Leidy + DBJ
 * @param requiredPermissions
 * @param requiredRoles
 * @returns the next function in the chain {@type NextFunction}
 */
export function PermRestrictionMiddleware(op: OpUnderRestriction<any>, input?: any | any[]): any {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (process.env.NODE_ENV !== "dev") {
            if (!req.decodedToken) {
                return returnProperInvalidResponse(req, res);
            }

            const perm = req.decodedToken.perm;
            const role = req.decodedToken.role;
            const result = await op.Execute(perm, role, input);

            if (result.failedToAuthorize) {
                return returnProperInvalidResponse(req, res);
            }
            return next();
        } else {
            return next();
        }
    };
}
