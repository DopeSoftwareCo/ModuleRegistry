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

const getInvalidMessage = (url: string) => {
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
    return null; // No match found
};

const returnProperInvalidResponse = (req: Request, res: Response) => {
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
 * @param req {@type Request} the request object from express
 * @param res {@type Response} the response from express
 * @param next {@type NextFunction} the next function to call
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
 * @param req {@type Request} the request object from express
 * @param res {@type Response} the response from express
 * @param next {@type NextFunction} the next function to call
 */
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        checkJwt(req, res, (err) => {
            if (err) {
                returnProperInvalidResponse(req, res);
            }
            processToken(req, res, next);
        });
    } catch (err) {
        returnProperInvalidResponse(req, res);
    }
};
