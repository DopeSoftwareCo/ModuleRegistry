import { Request, Response, NextFunction } from "express";
import { generateOutputSeparator, getColorBasedOnCode } from "./outputHelpers";
import { APP_CONFIG } from "../../config";
const chalk = require("chalk");

const responseLogger = (req: Request, res: Response, next: NextFunction) => {
    res.on("finish", function () {
        console.log(`Method: ${req.method}`);
        console.log(`URL: ${req.url}`);
        console.log(`Status Code: ${getColorBasedOnCode(res.statusCode, res.statusCode)}`);
        console.log("_________________________");
    });
    next();
};

export default responseLogger;
