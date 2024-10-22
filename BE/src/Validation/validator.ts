import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

const codeDetermination = {};

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        console.log(result);
        //we are only returning one validation error message... so no matter the number ofmessages we can return the first if it exists
        const errsStrArr = result.array();
        console.log(errsStrArr);
        if (errsStrArr.length > 0) {
            return res.status(400).send(errsStrArr[0].msg);
        }
    }
    next();
};
