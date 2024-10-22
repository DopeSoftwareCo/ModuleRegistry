import { Request, Response, NextFunction } from "express";

/**
 * @author John Leidy
 * @description This function allows us to have our controllers wrapped in an error catcher. The errorMiddleware catches these.
 * @param fn A func {@type Function}
 * @returns nothing {@type void}
 */
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
