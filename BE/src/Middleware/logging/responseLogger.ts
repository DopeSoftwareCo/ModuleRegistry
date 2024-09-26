import { Request, Response, NextFunction } from "express";
import { generateOutputSeparator, getColorBasedOnCode } from "./outputHelpers";
import { APP_CONFIG } from "../../config";
const chalk = require("chalk");

const responseLogger = (req: Request, res: Response, next: NextFunction) => {
    res.on("finish", function () {
        const currentTime = new Date();
        let ms = 0;
        if (req.startTime) {
            ms = currentTime.getTime() - req.startTime.getTime();
        }
        console.log("\n\n\nRESPONSE");
        console.log(`Method: ${req.method}`);
        console.log(`URL: ${req.url}`);
        console.log(`Status Code: ${getColorBasedOnCode(res.statusCode, res.statusCode)}`);
        console.log(`Headers: ${JSON.stringify(res.getHeaders(), null, 2)}`);
        console.log(generateOutputSeparator(ms.toString(), APP_CONFIG.outputWidth, res.statusCode));
    });
    next();
};

export default responseLogger;
