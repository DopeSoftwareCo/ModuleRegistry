import { Response, Request, NextFunction } from "express";
import * as jwt from "express-jwt";
import JwksRsa from "jwks-rsa";
import * as jsonwebtoken from "jsonwebtoken";
import {
    DeletePackageViaIDResponseMessages,
    GetPackagesInvalidResponseMessages,
    GetPackageViaIDInvalidResponseMessages,
    GetPackageViaRegexInvalidResponseMessages,
    GetRatingsForPackageInvalidResponses,
    ResetRegistryResponseMessages,
    UpdatePackageViaIDResponseMessages,
    UploadInjestResponseMessages,
} from "ResponseTypes";

/**
 * @author John Leidy
 * @description This function uses expressjwt to check the token
 */
export const checkJwt = jwt.expressjwt({
    audience: process.env.AUTH0_AUDIENCE,
    issuer: `https://${process.env.AUTH0_DOMAIN}/`,
    algorithms: ["RS256"],
    secret: JwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
    }) as jwt.GetVerificationKey,
});

const INVALID_MESSAGES: {
    "/packages": GetPackagesInvalidResponseMessages;
    "/reset": ResetRegistryResponseMessages;
    "/package/":
        | GetPackageViaIDInvalidResponseMessages
        | UpdatePackageViaIDResponseMessages
        | DeletePackageViaIDResponseMessages
        | GetRatingsForPackageInvalidResponses;
    "/package": UploadInjestResponseMessages;
    byregex: GetPackageViaRegexInvalidResponseMessages;
} = {
    "/packages":
        "There is missing field(s) in the PackageQuery/AuthenticationToken or it is formatted improperly, or the AuthenticationToken is invalid.",
    "/reset":
        "There is missing field(s) in the AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.",
    "/package/":
        "There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.",
    "/package":
        "There is missing field(s) in the PackageData/AuthenticationToken or it is formed improperly (e.g. Content and URL are both set), or the AuthenticationToken is invalid.",
    byregex:
        "There is missing field(S) in the PackageRegEx/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.",
};

/**
 * @author John Leidy
 * @description This function is responsible for getting a message to return to the user if the token was invalid.
 * @param url the original url from the request {@type string}
 * @returns an invalid message to return to the user or null @{@type string | undefined}
 */
export const getInvalidMessage = (url: string) => {
    if (url === "/packages") {
        return INVALID_MESSAGES["/packages"];
    } else if (url === "/reset") {
        return INVALID_MESSAGES["/reset"];
    } else if (/^\/package\/.*$/.test(url) && !url.includes("byRegEx")) {
        return INVALID_MESSAGES["/package/"];
    } else if (url === "/package") {
        return INVALID_MESSAGES["/package"];
    } else if (/^\/package\/.*$/.test(url) && url.includes("byRegEx")) {
        return INVALID_MESSAGES.byregex;
    }
    return undefined; // No match found
};

/**
 * @author John Leidy
 * @param req the request object from express {@type Request}
 * @param res the response from express {@type Response
 * @returns  a response {@type Response<any, Record<string, any>> | undefined}
 */
export const returnProperInvalidResponse = (req: Request, res: Response) => {
    const regex = /^\/packages$|^\/reset$|^\/package\/.*$|^\/package$/;

    if (regex.test(req.originalUrl)) {
        const message = getInvalidMessage(req.originalUrl);
        if (message) {
            return res.status(400).send(message);
        }
    }
};

/**
 * @author John Leidy
 * @description This function processes the token if it exists and continues down the middlware chain if its valid.
 * permissions and username are appended to the request object.
 * @param req the request object from express {@type Request}
 * @param res the response from express {@type Response
 * @param next the next function to call {@type NextFunction}
 */
const processToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (token) {
        const decodedToken: jsonwebtoken.TokenType = jsonwebtoken.decode(token) as jsonwebtoken.TokenType;
        if (decodedToken?.permissions && decodedToken?.username) {
            req.username = decodedToken.username;
            req.permissions = decodedToken.permissions;
            next();
        }
    }

    returnProperInvalidResponse(req, res);
};

/**
 * @author John Leidy
 * @description This middleware is responsible for verifying a tokens validitiy.
 * @param req the request object from express {@type Request}
 * @param res the response from express {@type Response
 * @param next the next function to call {@type NextFunction}
 */
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    if (process.env.NODE_ENV !== "dev") {
        try {
            checkJwt(req, res, (err) => {
                if (err) {
                    // If there's an error with checkJwt, handle it here
                    return returnProperInvalidResponse(req, res); // Return here to stop further execution
                }
                processToken(req, res, next);
            });
        } catch (err) {
            // Handle any other errors that might occur
            return returnProperInvalidResponse(req, res);
        }
    } else {
        next();
    }
};
