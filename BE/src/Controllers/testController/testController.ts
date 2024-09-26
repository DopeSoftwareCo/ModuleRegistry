import { NextFunction, Response } from "express";
import asyncHandler from "../../Middleware/asyncHandler";
import { TestRequest } from "RequestTypes";

export const TestController = asyncHandler((req: TestRequest, res: Response, next: NextFunction) => {
    res.status(200).send({
        message: `everything seems to be operational! Your test request body test field contained: ${req.body.test}`,
    });
});
