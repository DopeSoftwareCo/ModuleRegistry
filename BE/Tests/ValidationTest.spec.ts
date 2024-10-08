import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { GetPackagesRules } from "../src/Validation/PackagesValidationRules/GetPackagesRules";
import { AuthenticationRules } from "../src/Validation/AuthRules/AuthRules";
import { ByRegexRules } from "../src/Validation/PackageValidationRules/ByRegexRules";
import { GeneralViaIDRuleset } from "../src/Validation/PackageValidationRules/GeneralByIDRules";
import { ResetRules } from "../src/Validation/PackageValidationRules/ResetRules";
import { UploadPackageRules } from "../src/Validation/PackageValidationRules/UploadRules";
import express, { Express, Request, Response } from "express";
import { validateRequest } from "../src/Validation/validator";
import SuperTest from "supertest";
const RuleSets = {
    Authentication: AuthenticationRules,
    GetPackages: GetPackagesRules,
    GetByRegex: ByRegexRules,
    ByID: GeneralViaIDRuleset,
    Reset: ResetRules,
    UploadPackage: UploadPackageRules,
};

describe("Validation", () => {
    let app: Express;

    // Create a new Express application instance before each test
    beforeEach(() => {
        app = express();
        app.use(express.json());
    });
    Object.entries(RuleSets).forEach(([endpoint, ruleset]) => {
        it(`Should return 400 for endpoint ${endpoint} if the request is invalid.`, async () => {
            app.get("/", ruleset, validateRequest, (req: Request, res: Response) => {
                res.status(200);
            });

            const response = await SuperTest(app).get("/").send({});

            expect(response.status).toBe(400);
        });
    });
});
