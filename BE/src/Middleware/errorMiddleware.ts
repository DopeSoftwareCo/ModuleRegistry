import { NextFunction, Request, Response } from "express";
import { CustomError } from "../classes/CustomError";

/**
 * @author John Leidy
 * @description An error handler to catch all errors throughout the application.
 * @param err The error caught {@type Error}
 * @param req The express request object being passed down the chain
 * @param res The express response objecte being passed down the chain
 * @param next The exprss next function being passed down the chain
 * @returns
 */
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof CustomError) {
        const { statusCode, errors, logging } = err;
        if (logging) {
            console.error(
                JSON.stringify(
                    {
                        code: err.statusCode,
                        errors: err.errors,
                        stack: err.stack,
                    },
                    null,
                    2
                )
            );
        }

        return res.status(statusCode).send({ "error type": "CustomError", errors });
    }
    if (err instanceof Error) {
        return res.status(500).send(err.message);
    }

    console.error(JSON.stringify(err, null, 2));
    return res.status(500).send({ "error type": "Uknown" });
};
