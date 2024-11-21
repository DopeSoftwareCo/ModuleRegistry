import { Request } from "express";
import mongoose from "mongoose";
import { PermissionEnum, Role } from "../../Classes/Users/subdir.const";

declare global {
    namespace Express {
        export interface Request {
            startTime?: Date;
            username?: string;
            permission?: PermissionEnum;
            role?: Role;
            requestedId?: string;
            userID?: string;
            decodedToken?: jsonwebtoken.TokenType;
        }
    }
}
