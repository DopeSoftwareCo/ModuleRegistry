import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

const codeDetermination = {};

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
    console.log("validate request");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
