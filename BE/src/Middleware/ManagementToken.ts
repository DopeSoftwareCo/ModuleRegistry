import { NextFunction, Request, Response } from "express";
import { getManagementToken } from "../Providers/Auth0/ManagementToken";
import * as jsonwebtoken from "jsonwebtoken";

export let token: string | null = null;
export let expiration: number | undefined = undefined;

const tokenIsExpired = () => {
    return expiration ? Date.now() >= expiration : true;
};

export const checkManagementToken = async (req: Request, res: Response, next: NextFunction) => {
    GenerateManagementToken();
    next();
};

export async function GenerateManagementToken() {
    if (!token || !expiration || tokenIsExpired()) {
        // Token is bad for some reason or another, so make another
        token = await getManagementToken();
        if (token) {
            const decodedToken: jsonwebtoken.TokenType = jsonwebtoken.decode(token) as jsonwebtoken.TokenType;
            expiration = decodedToken.exp;
        } else {
            throw new Error("Failed to make management toke.n");
        }
    }
}

export const setFakeToken = () => {
    token = "fakeToken";
};
