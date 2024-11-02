import { NextFunction, Request, Response } from "express";

export let token = undefined;
export let expiration = undefined;

const tokenIsExpired = () => {
    //some logic determining if its expired
    return false;
};

export const checkManagementToken = (req: Request, res: Response, next: NextFunction) => {
    if (!token || !expiration || tokenIsExpired()) {
        //need to get the token and expiration
    }
    next();
};
