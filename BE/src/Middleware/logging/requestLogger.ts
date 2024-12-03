import { Request, Response, NextFunction } from "express";
import { generateOutputSeparator } from "./outputHelpers";
import { APP_CONFIG } from "../../config";

const logRequest = (req: Request, res: Response, next: NextFunction) => {
    console.log("_________________________");
    console.log(`Method: ${req.method}`);
    console.log(`URL: ${req.url}`);
    console.log(`Body: ${JSON.stringify(req.body, null, 2)}`);
    next();
};

export default logRequest;
