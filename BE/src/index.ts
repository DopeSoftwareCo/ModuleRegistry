import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { errorHandler } from "./Middleware/errorMiddleware";
import responseLogger from "./Middleware/logging/responseLogger";
import { testRouter } from "./Routes/testRoute";
import listRoutes from "./Middleware/logging/showRoutes";
import logRequest from "./Middleware/logging/requestLogger";
import chalk from "chalk";

dotenv.config();

const addRoutes = (app: Express) => {
    app.use("/test", testRouter);
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
