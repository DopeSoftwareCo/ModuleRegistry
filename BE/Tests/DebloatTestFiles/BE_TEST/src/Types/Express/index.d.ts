import { Request } from "express";
import mongoose from "mongoose";

declare global {
    namespace Express {
        export interface Request {
            startTime?: Date;
            username?: string;
            permission?: string[];
            requestedId?: string;
            userID?: string;
            decodedToken?: jsonwebtoken.TokenType;
        }
    }
}
