import { AuthenticationRequest } from "RequestTypes";
import asyncHandler from "../Middleware/asyncHandler";
import { AuthenticateInvalidResponses, AuthenticationResponse } from "ResponseTypes";
import { NextFunction } from "express";
// /authenticate
export const Authcontroller = asyncHandler(
    async (req: AuthenticationRequest, res: AuthenticationResponse, next: NextFunction) => {
        //hover for custom typed body
        const body = req.body;
        //use the body data for your code here

        //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

        const token: string = "EXAMPLE TOKEN";

        //some value signifying user or password is invalid
        const invalidUserPass = false;

        //some value signifying system does not support auth
        const unsupported = false;
        //this type is a union of our return strings
        let responseMessage: AuthenticateInvalidResponses;
        if (!invalidUserPass && !unsupported) {
            res.status(200).send(token);
        } else if (invalidUserPass) {
            responseMessage = "The user or password is invalid.";
            res.status(401).send(responseMessage);
        } else if (unsupported) {
            responseMessage = "The system does not support authentication.";
            res.status(501).send(responseMessage);
        }
    }
);
