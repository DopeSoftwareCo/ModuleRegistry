import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

const codeDetermination = {};

/**
 * @author John Leidy
 * @description This function is responsible for parsing the validation result and returning the message.
 * The message is created via .withMessage() in the rulesets. Normally it's best to return the array of errors during dev, not all errs during prod.
 * This will give a detailed response as to what exactly went wrong during validation as all are captured.
 * However for the purpose of this project it has been reduced to return the first item, since all items are the same message.
 * @param req The express request object being passed down the chain
 * @param res The express response objecte being passed down the chain
 * @param next The exprss next function being passed down the chain
 * @returns either a response, or continues to the next function in the chain
 */
export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        //we are only returning one validation error message... so no matter the number ofmessages we can return the first if it exists
        const errsStrArr = result.array();
        if (errsStrArr.length > 0) {
            return res.status(400).send(errsStrArr[0].msg);
        }
    }
    next();
};
