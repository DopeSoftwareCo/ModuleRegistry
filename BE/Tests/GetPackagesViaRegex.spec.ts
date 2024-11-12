import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import express, { Express } from "express";
import SuperTest from "supertest";
import { GetPackagesViaRegexController } from "../src/Controllers/GetPackageControllers";
import PackageModel from "../src/Schemas/Package";
import asyncHandler from "../src/Middleware/asyncHandler";

// Mock the PackageModel
jest.mock("../src/Schemas/Package");

const app: Express = express();
app.use(express.json());
app.post("/byRegex", asyncHandler(GetPackagesViaRegexController));

describe("GetPackagesViaRegexController", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return packages matching the regex", async () => {
        const mockPackages = [
            {
                metadata: { Name: "test-package", Version: "1.0.0" },
                _id: "1",
                data: { Content: "test content" },
            },
            {
                metadata: { Name: "another-package", Version: "2.0.0" },
                _id: "2",
                data: { Content: "another content" },
            },
        ];

        (PackageModel.find as jest.Mock).mockResolvedValue(mockPackages);

        const response = await SuperTest(app).post("/byRegex").send({ RegEx: "test" });

        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            { Version: "1.0.0", Name: "test-package", ID: "1" },
            { Version: "2.0.0", Name: "another-package", ID: "2" },
        ]);
    });

    it("should return 404 if no packages match the regex", async () => {
        (PackageModel.find as jest.Mock).mockResolvedValue([]);

        const response = await SuperTest(app).post("/byRegex").send({ RegEx: "nonexistent" });

        expect(response.status).toBe(404);
        expect(response.text).toBe("No package found under this regex.");
    });

    it("should handle errors gracefully", async () => {
        (PackageModel.find as jest.Mock).mockRejectedValue(new Error("Database error"));

        const response = await SuperTest(app).post("/byRegex").send({ RegEx: "test" });

        expect(response.status).toBe(500);
    });
});
