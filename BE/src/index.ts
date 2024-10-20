import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { errorHandler } from "./Middleware/errorMiddleware";
import responseLogger from "./Middleware/logging/responseLogger";
import { testRouter } from "./Routes/testRoute";
import listRoutes from "./Middleware/logging/showRoutes";
import logRequest from "./Middleware/logging/requestLogger";
import chalk from "chalk";
import { PackageRouter } from "./Routes/PackageRoutes";
import { PackagesRouter } from "./Routes/PackagesRoutes";
import { ResetRouter } from "./Routes/ResetRoutes";
import { AuthRouter } from "./Routes/AuthRoutes";
import mongoose from "mongoose";
import { RunEvalSubsystemDemo } from "./Providers/ModEval/DevTools/SubsystemDemo";
dotenv.config();

const envVarNames = [
    "GITHUB_TOKEN",
    "AUTH0_CLIENT_ID",
    "AUTH0_CLIENT_SECRET",
    "AUTH0_AUDIENCE",
    "AUTH0_DOMAIN",
    "NODE_ENV",
    "MONGODB_URL",
];

const checkEnvs = () => {
    const missingEnvs = envVarNames.filter((name) => !process.env[name]);
    if (missingEnvs.length > 0) {
        console.log(`You are missing the following env${missingEnvs.length > 1 ? "s" : ""}:`);
        missingEnvs.forEach((name) => console.log(name));
        process.exit(1);
    }
};

const showCollectionNames = (
    collections:
        | (mongoose.mongo.CollectionInfo | Pick<mongoose.mongo.CollectionInfo, "name" | "type">)[]
        | undefined,
    db: mongoose.mongo.Db | undefined
) => {
    const collectionNames = collections?.map((collection) => collection.name);
    console.log(`\n✅ ${chalk.greenBright("Mongo DB")} connected successfully, DB -> ${db?.databaseName}`);
    console.log(`✅ ${chalk.greenBright("Collections")} -> ${collectionNames?.join(", ")}`);
};

const addRoutes = (app: Express) => {
    app.use("/test", testRouter);
    app.use("/package", PackageRouter);
    app.use("/packages", PackagesRouter);
    app.use("/reset", ResetRouter);
    app.use("/authenticate", AuthRouter);
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
    app.use(responseLogger);
};

const runServer = async () => {
    checkEnvs();
    if (!process.env.MONGODB_URL) {
        process.exit(1);
    }
    const mongooseInstance = await mongoose.connect(process.env.MONGODB_URL);
    const db = mongooseInstance.connection.db;
    const collections = await db?.listCollections().toArray();
    showCollectionNames(collections, db);
    const app: Express = express();
    const port = process.env.PORT || 3000;

    addMiddleWare(app);
    addRoutes(app);
    listRoutes(app);
    app.use(errorHandler);

    app.listen(port, () => {
        console.log(chalk.greenBright.bold(`[server]: Server is running at http://localhost:${port}`));
    });
};

async function Execute() {
    await runServer();
    console.log("=== Here's an evaluation demo! ===");
    await RunEvalSubsystemDemo(1);
}

Execute();
