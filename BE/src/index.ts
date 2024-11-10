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
import { TracksRouter } from "./Routes/TrackRoutes";
import { UserRouter } from "./Routes/UserRoutes";
import { GenerateManagementToken } from "./Middleware/ManagementToken";
import { Test_Auth0 } from "../Tests/ManualTests/DatabaseCommunications";
import { Auth0_Database } from "./Providers/Auth0/Auth0_DB";
import { permission } from "process";

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
    app.use("/tracks", TracksRouter);
    app.use("/users", UserRouter);
};

const addMiddleWare = (app: Express) => {
    app.use(
        cors({
            origin: "*",
            methods: "*",
            allowedHeaders: "*",
        })
    );
    app.use(express.json({ limit: "10mb" }));
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

async function RunDemo_ModEval() {
    console.log("=== Here's an evaluation demo! ===");
    await RunEvalSubsystemDemo(2);
}

const currentUsers = [
    { user_id: "auth0|670aaa9d690c6fe8e0d0ceb1" },
    { user_id: "auth0|6726bfa8ba7c0c3e1bddb02f" },
    { user_id: "auth0|672666803cf3ee6ca06f0783" },
    { user_id: "auth0|67267770811352d1f3ee80c1" },
    //
    { user_id: "auth0|671eeb736d7e32b41f73ef85" },
    { user_id: "auth0|671eea82ebe6fb9d387a2387" },
    { user_id: "auth0|671eeaa8d7dd87d554e5611d" },
    { user_id: "auth0|671eeaeca0264cb1fe7a5516" },
    { user_id: "auth0|671eeb0c7ed11ed361ff67d6" },
    { user_id: "auth0|671eeb274c718dbc6226fa45" },
    { user_id: "auth0|671eeb3f6d7e32b41f73ef6c" },
    { user_id: "auth0|671eeb5eebe6fb9d387a2405" },
    //
    { user_id: "oauth2|discord|363872785950441472" },
    { user_id: "google-oauth2|113004467258994058267" },
    { user_id: "google-oauth2|103694541876851692084" },
    { user_id: "auth0|6529cab888412146d57f4dcc" },
];

const profiles = [
    { uid: "auth0|671eeb736d7e32b41f73ef85", permission: 7, role: 1 },
    { uid: "auth0|671eea82ebe6fb9d387a2387", permission: 0, role: 1 },
    { uid: "auth0|671eeaa8d7dd87d554e5611d", permission: 1, role: 1 },
    { uid: "auth0|671eeaeca0264cb1fe7a5516", permission: 2, role: 1 },
    { uid: "auth0|671eeb0c7ed11ed361ff67d6", permission: 3, role: 1 },
    { uid: "auth0|671eeb274c718dbc6226fa45", permission: 4, role: 1 },
    { uid: "auth0|671eeb3f6d7e32b41f73ef6c", permission: 5, role: 1 },
    { uid: "auth0|671eeb5eebe6fb9d387a2405", permission: 6, role: 1 },
];

const admins = [
    { uid: "auth0|670aaa9d690c6fe8e0d0ceb1", permission: 7, role: 3 },
    { uid: "auth0|6726bfa8ba7c0c3e1bddb02f", permission: 7, role: 3 },
    { uid: "auth0|672666803cf3ee6ca06f0783", permission: 7, role: 3 },
    { uid: "auth0|67267770811352d1f3ee80c1", permission: 7, role: 3 },
];

const johnProfiles = [
    { uid: "oauth2|discord|363872785950441472", permission: 7, role: 1 },
    { uid: "google-oauth2|113004467258994058267", permission: 7, role: 1 },
    { uid: "google-oauth2|103694541876851692084", permission: 7, role: 1 },
    { uid: "auth0|6529cab888412146d57f4dcc", username: "JohnnyL", permission: 7, role: 3 },
];

const deleteThese = [
    "auth0|672678e4ba7c0c3e1bdd8afc",
    "auth0|672ffa35909ed2cf0d42a23c",
    "auth0|67267a31174fb41760522b64",
];

async function Execute() {
    await GenerateManagementToken();

    const evilJohn = "auth0|672677d8fd7b008c6635cb44";
    const evilTony = "auth0|6726799cba7c0c3e1bdd8b58";
    const Tony = "auth0|672678e4ba7c0c3e1bdd8afc";

    /*const promises = unnamed.map(async (profile) => {
        try {
            await Auth0_Database.UPDATE(profile);
        } catch (error) {
            console.log("=== Failed to update user: %s ===", profile.uid);
            console.log(error);
        }
    });
    await Promise.all(promises);
    console.log("done");*/

    await runServer();
}

const shrek = "auth0|672ffa35909ed2cf0d42a23c";

Execute();
