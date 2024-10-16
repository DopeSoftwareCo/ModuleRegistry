import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { errorHandler } from "./Middleware/errorMiddleware";
import responseLogger from "./Middleware/logging/responseLogger";
import { testRouter } from "./Routes/testRoute";
import listRoutes from "./Middleware/logging/showRoutes";
import logRequest from "./Middleware/logging/requestLogger";
import chalk from "chalk";
import { ModEval } from "./Providers/ModEval/MainDriver";
import './envConfig';
/*
import { ProvideURLsForQuerying } from "./Providers/RawAssets/Primero/MVP/src/Input/Sanitize";
import { TargetRepository } from "./Providers/ModEval/Types/RepoIDTypes";
import { RepoQueryBuilderNew, RequestFromGQLNew } from "./Providers/ModEval/Querying/QueryBuilder";
import {
    createCommitsFieldNew,
    createLicenseFieldNew,
    createReadmeFieldNew,
    createTestMainQueryNew,
    createTestMasterQueryNew,

} from "./Providers/ModEval/Querying/Builders/QueryFields";
import { ModuleRouter } from "./Routes/ModulesRoute";
*/

dotenv.config();
if(!process.env.GITHUB_TOKEN) { process.exit(1); }

/*
const addRoutes = (app: Express) => {
    app.use("/test", testRouter);
    app.use("/modules", ModuleRouter);
};

const addMiddleWare = (app: Express) => {
    app.use(
        cors({
            origin: "*",
            methods: "*",
            allowedHeaders: "*",
        })
    );
    app.use(express.json());
    app.use(logRequest);
    app.use(errorHandler);
    app.use(responseLogger);
};

const app: Express = express();
const port = process.env.PORT || 3000;
addMiddleWare(app);
addRoutes(app);
listRoutes(app);
app.listen(port, () => {
    console.log(chalk.greenBright.bold(`[server]: Server is running at http://localhost:${port}`));
});
*/


ModEval(3);