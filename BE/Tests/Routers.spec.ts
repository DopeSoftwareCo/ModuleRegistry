import { beforeEach, describe, expect, it } from "@jest/globals";
import express, { Express } from "express";
import SuperTest, { Response } from "supertest";
import { PackagesRouter } from "../src/Routes/PackagesRoutes";
import { ResetRouter } from "../src/Routes/ResetRoutes";
import { PackageRouter } from "../src/Routes/PackageRoutes";
import { AuthRouter } from "../src/Routes/AuthRoutes";
import { testRouter } from "../src/Routes/testRoute";
import listRoutes from "../src/Middleware/logging/showRoutes";
const AppRouters = {
    Packages: { router: PackagesRouter, path: "", type: "post" },
    Reset: { router: ResetRouter, path: "", type: "delete" },
    GetPackageWithID: { router: PackageRouter, path: "/someid", type: "get" },
    UpdatePackage: { router: PackageRouter, path: "/someid", type: "put" },
    UploadPackage: { router: PackageRouter, path: "", type: "post" },
    GetPackageRating: { router: PackageRouter, path: "/someid/rate", type: "get" },
    Authenitcation: { router: AuthRouter, path: "", type: "put" },
    GetByRegex: { router: PackageRouter, path: "/byRegex", type: "get" },
    TestController: { router: testRouter, path: "", type: "post" },
};

const app: Express = express();
app.use(express.json);

describe("Request tests", () => {
    let app: Express;
    beforeEach(() => {
        app = express();
        app.use(express.json());
    });
    Object.entries(AppRouters).forEach(([routeName, router]) => {
        it(`Should return a valid response, showing route is found and created for ${routeName}`, async () => {
            app.use(router.router);
            let response: Response;
            switch (router.type) {
                case "post":
                    response = await SuperTest(app).post(router.path);
                    break;
                case "put":
                    response = await SuperTest(app).put(router.path);
                    break;
                case "delete":
                    response = await SuperTest(app).delete(router.path);
                    break;
                default:
                    response = await SuperTest(app).get(router.path);
                    break;
            }
            expect(response.status).not.toBe(404);
        });
    });
});
