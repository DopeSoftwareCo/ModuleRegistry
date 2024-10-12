import { Request } from "express";

declare global {
    namespace Express {
        export interface Request {
            startTime?: Date;
            username?: string;
            permissions?: string[];
        }
    }
}
