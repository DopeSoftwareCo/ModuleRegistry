import { beforeEach, describe, expect, it } from "@jest/globals";
import express, { Express } from "express";
import {
    GetPackageRatingsViaIDController,
    GetPackagesFromRegistryController,
    GetPackagesViaRegexController,
    GetPackageViaIDController,
} from "../src/Controllers/GetPackageControllers";
import { ResetControllerDANGER } from "../src/Controllers/DeleteControllers";
import { UpdatePackageViaIDController } from "../src/Controllers/UpdatePackageControllers";
import { UploadInjestController } from "../src/Controllers/UploadInjestControllers";
import { Authcontroller } from "../src/Controllers/AuthController";
import SuperTest from "supertest";
import { TestController } from "../src/Controllers/testController/testController";
const AppRoutes = {
    Packages: GetPackagesFromRegistryController,
    Reset: ResetControllerDANGER,
    GetPackageWithID: GetPackageViaIDController,
    UpdatePackage: UpdatePackageViaIDController,
    UploadPackage: UploadInjestController,
    GetPackageRating: GetPackageRatingsViaIDController,
    Authentication: Authcontroller,
    GetByRegex: GetPackagesViaRegexController,
    TestController: TestController,
};

const app: Express = express();
app.use(express.json);

describe("Request tests", () => {
    let app: Express;
    beforeEach(() => {
        app = express();
        app.use(express.json());
    });
    Object.entries(AppRoutes).forEach(([routeName, controller]) => {
        it(`Should return a valid response for ${routeName}`, async () => {
            if (routeName !== "Authentication") {
                app.get("/", controller);
                const response = await SuperTest(app).get("/");
                expect(response.status).toBe(200);
            } else {
                app.get("/", controller);
                const response = await SuperTest(app).get("/");
                expect(response.status).toBe(401);
            }
        });
    });
});
