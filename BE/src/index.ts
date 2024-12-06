import express, { Express } from "express";
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
import { TracksRouter } from "./Routes/TrackRoutes";
import { UserRouter } from "./Routes/UserRoutes";
import { GenerateManagementToken } from "./Middleware/ManagementToken";
import { CatchAllRouter } from "./Routes/CatchAll";
import { calculateCumulativeSize } from "./Services/Packages/Cost/Multicost";
import { GetPackagesData } from "RequestTypes";
import { ensureUploadFoldersExist } from "./Utils/FileDir";
import { ProcessPackageSearch } from "./Services/Packages/Versioning/search-functions";
import PackageModel, { Package } from "./Schemas/Package";
import { FetchAllPackages } from "./Services/Packages/BasicFunctionality/FetchAll";

dotenv.config();

const envVarNames = [
    "GITHUB_TOKEN",
    "AUTH0_CLIENT_ID",
    "AUTH0_CLIENT_SECRET",
    "AUTH0_AUDIENCE",
    "AUTH0_DOMAIN",
    "NODE_ENV",
    "MONGODB_URL",
    "API_CLIENT_ID",
    "API_CLIENT_SECRET",
    "MANAGEMENT_API_TOKEN_REQUEST_AUDIENCE",
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
    app.use("/", CatchAllRouter);
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

function ManualTestMulticost(packages: string[]) {
    const packageManager = "npm"; // or 'yarn'
    const totalSize = calculateCumulativeSize(packages, packageManager);

    console.log(`Total size cost for packages [${packages.join(", ")}]: ${totalSize / 1024} KB`);
}
export const createRandomPackage = async (version: string, name: string) => {
    const newPackage: Package = new PackageModel({
        Title: name,
        repoUrl: "https://github.com/example/package",
        metadata: {
            Name: name,
            Version: version,
            License: {
                name: "MIT",
                spxId: "MIT",
                url: "https://opensource.org/licenses/MIT",
            },
            Uploader: "Uploader123",
            IsExternal: true,
            Safety: "vetted",
            IsSecret: false,
            Visibility: "public",
            Availability: Math.random(),
            PrivelegedGroup: Math.random(),
        },
        data: {
            Content: "Example content for the package.",
            JSProgram: "console.log('Hello, World!');",
        },
        RampupTime: {
            rampup_score: Math.random(),
            rampup_score_latency: Math.random(),
        },
        Correctness: {
            score_correctness: Math.random(),
            score_correctness_latency: Math.random(),
        },
        BusFactor: {
            score_busFactor: Math.random(),
            score_busFactor_latency: Math.random(),
        },
        Responsiveness: {
            score_responsiveMaintainer: Math.random(),
            score_responsiveMaintainer_latency: Math.random(),
        },
        LicenseCompatibility: {
            score_license: Math.random(),
            score_license_latency: Math.random(),
        },
        VersionDependence: {
            score_versionDependence: Math.random(),
            score_versionDependence_latency: Math.random(),
        },
        MergeRestriction: {
            score_mergeRestriction: Math.random(),
            score_mergeRestriction_latency: Math.random(),
        },
        IndividualSizeCost: {
            score_sizeCostStandalone: Math.random(),
            score_sizeCostStandalone_latency: Math.random(),
        },
        TotalSizeCost: {
            score_sizeCostTotal: Math.random(),
            score_sizeCostTotal_latency: Math.random(),
        },
        GoodPinningPractice: {
            score_goodPinningPractice: Math.random(),
            score_goodPinningPracticeLatency: Math.random(),
        },
        PullRequest: {
            score_pullRequest: Math.random(),
            score_pullRequestLatency: Math.random(),
        },
        FinalRating: {
            netscore: Math.random(),
            netscore_latency: Math.random(),
        },
    });
    const savedPackage = await newPackage.save();
    return savedPackage._id.toString();
};

const InsertPackages = (ps: { name: string; version: string }[]) => {
    ps.forEach((p) => createRandomPackage(p.version, p.name));
};

async function ManualTestVersionSort() {
    /*
        InsertPackages([
        { name: "dsinc", version: "1.0.0" },
        { name: "dsinc", version: "1.5.2" },
        { name: "dsinc", version: "1.5.4" },
        { name: "dsinc", version: "1.5.6" },
        { name: "dsinc", version: "1.5.8" },
        { name: "dsinc", version: "1.5.10" },
        { name: "dsinc", version: "1.5.12" },
        { name: "dsinc", version: "1.6.10" },
        { name: "dsinc", version: "1.6.12" },
        { name: "dsinc", version: "1.6.14" },
        { name: "dsinc", version: "1.6.16" },
        { name: "dsinc", version: "1.6.18" },
        { name: "dsinc", version: "1.6.20" },
        { name: "dsinc", version: "1.9.5" },
        { name: "dsinc", version: "1.9.10" },
        { name: "dsinc", version: "1.9.15" },
        { name: "dsinc", version: "1.9.20" },
        { name: "dsinc", version: "2.9.21" },
        { name: "dsinc", version: "2.0.0" },
        { name: "dsinc", version: "2.2.0" },
        { name: "dsinc", version: "2.2.2" },
        { name: "dsinc", version: "8.3.0" },
        { name: "dsinc", version: "8.4.0" },
        { name: "dsinc", version: "8.4.1" },
        { name: "dsinc", version: "8.4.2" },
        { name: "dsinc", version: "8.5.1" },
        { name: "dsinc", version: "8.6.3" },
        { name: "dsinc", version: "11.6.6" },
        { name: "dsinc", version: "11.6.9" },
        { name: "dsinc", version: "16.0.0" },
    ]);
    */
    const req: GetPackagesData[] = [
        {
            Name: "dsinc",
            Version: "11.0.0-18.0.0",
        },
        {
            Name: "dsinc",
            Version: "~8.4.0",
        },
    ];
    const result = await ProcessPackageSearch(req, 5, true);
    console.log(result.dataPartitions);
}

async function ManualTestFetchAll() {
    const result = await FetchAllPackages(10000, 20);
    const pages = result.chunks;

    pages.forEach((page) => {
        console.log(page);
    });
}

async function Execute() {
    GenerateManagementToken();
    ensureUploadFoldersExist();
    await runServer();

    // awit ManualTestVersionSort();
    // await ManualTestFetchAll();
}

Execute();
