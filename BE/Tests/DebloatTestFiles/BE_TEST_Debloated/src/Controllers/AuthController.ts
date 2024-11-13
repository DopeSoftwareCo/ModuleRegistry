import { AuthenticationRequest } from "RequestTypes";
import asyncHandler from "../Middleware/asyncHandler";
import { AuthenticateInvalidResponses, AuthenticationResponse } from "ResponseTypes";
import { NextFunction } from "express";
import { authenticateViaAuth0 } from "../Providers/Auth0/AuthenticateAuth0";

/**
 * @author John Leidy
 * @description This controller is responsible for authenticating users via username and password and returning the token or invalid message to the user.
 * @param req {@type AuthenticationRequest}
 * @param res {@type AuthenticationResponse}
 * @param next {@type NextFunction}
 */
export const Authcontroller = asyncHandler(
    async (req: AuthenticationRequest, res: AuthenticationResponse, next: NextFunction) => {
        const body = req.body;
        const { invalidUserPass, token } = await authenticateViaAuth0(body);
        const unsupported = false;
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
