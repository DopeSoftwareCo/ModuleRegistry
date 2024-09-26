import { Request, Response, NextFunction } from "express";
import { generateOutputSeparator } from "./outputHelpers";
import { APP_CONFIG } from "../../config";

const logRequest = (req: Request, res: Response, next: NextFunction) => {
    req.startTime = new Date();
    console.log(generateOutputSeparator("New  Request", APP_CONFIG.outputWidth));
    console.log(`Method: ${req.method}`);
    console.log(`URL: ${req.url}`);
    console.log(`Headers: ${JSON.stringify(req.headers, null, 2)}`);
    console.log(`Body: ${JSON.stringify(req.body, null, 2)}`);
    next();
};

export default logRequest;
