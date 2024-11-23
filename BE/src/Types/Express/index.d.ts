import { Request } from "express";
import mongoose from "mongoose";
import { Permission, Role } from "../../Services/AdminUser/UserData";

declare global {
    namespace Express {
        export interface Request {
            startTime?: Date;
            username?: string;
            permission?: Permission;
            role?: Role;
            requestedId?: string;
            userID?: string;
            decodedToken?: jsonwebtoken.TokenType;
        }
    }
}
