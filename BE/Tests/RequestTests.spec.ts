import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import express, { Express, NextFunction, Request, Response } from "express";
import {
    GetPackageRatingsViaIDController,
    GetPackagesFromRegistryController,
    GetPackageSizeCostViaIDController,
    GetPackagesViaRegexController,
    GetPackageViaIDController,
} from "../src/Controllers/GetPackageControllers";
import { ResetControllerDANGER } from "../src/Controllers/DeleteControllers";
import { UpdatePackageViaIDController } from "../src/Controllers/UpdatePackageControllers";
import { UploadInjestController } from "../src/Controllers/UploadInjestControllers";
import { Authcontroller } from "../src/Controllers/AuthController";
import SuperTest from "supertest";
import { TestController } from "../src/Controllers/testController/testController";
import PackageModel from "../src/Schemas/Package";
import { GetTracksController } from "../src/Controllers/TracksController";

// Mock the PackageModel
jest.mock("../src/Schemas/Package");

type RouteConfig = {
    controller: any; // Replace `any` with the appropriate type for your controllers
    responseCode: number;
    requestType: "GET" | "POST" | "PUT" | "DELETE"; // Add more types as needed
};

const AppRoutes: Record<string, RouteConfig> = {
    Packages: {
        controller: GetPackagesFromRegistryController,
        responseCode: 200,
        requestType: "GET",
    },
    Reset: {
        controller: ResetControllerDANGER,
        responseCode: 200,
        requestType: "POST",
    },
    GetPackageWithID: {
        controller: GetPackageViaIDController,
        responseCode: 200,
        requestType: "GET",
    },
    UpdatePackage: {
        controller: UpdatePackageViaIDController,
        responseCode: 404,
        requestType: "POST",
    },
    UploadPackage: {
        controller: UploadInjestController,
        responseCode: 200,
        requestType: "POST",
    },
    GetPackageRating: {
        controller: GetPackageRatingsViaIDController,
        responseCode: 404,
        requestType: "GET",
    },
    GetPackageSizeCost: {
        controller: GetPackageSizeCostViaIDController,
        responseCode: 200,
        requestType: "GET",
    },
    Authentication: {
        controller: Authcontroller,
        responseCode: 401,
        requestType: "POST",
    },
    GetByRegex: {
        controller: GetPackagesViaRegexController,
        responseCode: 200,
        requestType: "GET",
    },
    TestController: {
        controller: TestController,
        responseCode: 200,
        requestType: "GET",
    },
    Track: {
        controller: GetTracksController,
        responseCode: 200,
        requestType: "GET",
    },
};
const app: Express = express();
app.use(express.json);

const assignRouteViaString = (
    app: Express,
    routePath: string,
    requestType: string,
    controller: (req: Request, res: Response, next: NextFunction) => void
) => {
    switch (requestType) {
        case "GET":
            app.get(routePath, controller);
            break;
        case "POST":
            app.post(routePath, controller);
            break;
        case "PUT":
            app.put(routePath, controller);
            break;
        case "DELETE":
            app.delete(routePath, controller);
            break;
        default:
            throw new Error(`Unsupported request type: ${requestType}`);
    }
};

const makeRequestViaString = async (app: Express, requestType: string, path: string) => {
    switch (requestType.toUpperCase()) {
        case "GET":
            return await SuperTest(app).get(path);
        case "POST":
            return await SuperTest(app).post(path);
        case "PUT":
            return await SuperTest(app).put(path);
        case "DELETE":
            return await SuperTest(app).delete(path);
        default:
            throw new Error(`Unsupported request type: ${requestType}`);
    }
};

describe("Request tests", () => {
    let app: Express;
    beforeEach(() => {
        app = express();
        app.use(express.json());
        Object.entries(AppRoutes).forEach(([routeName, config]) => {
            const routePath = `/${routeName}`;
            assignRouteViaString(app, routePath, config.requestType, config.controller);
        });
        const mockedPackages = [
            { _id: "1", name: "Package 1" },
            { _id: "2", name: "Package 2" },
        ];

        (PackageModel.find as jest.Mock).mockResolvedValue(mockedPackages as unknown as never);
    });
    Object.entries(AppRoutes).forEach(([routeName, config]) => {
        it(`Should return a valid response for ${routeName}`, async () => {
            const response = await makeRequestViaString(app, config.requestType, `/${routeName}`);
            expect(response.status).toBe(config.responseCode);
        });
    });
});
