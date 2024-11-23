import {
    CalculateStandaloneCost,
    CalculateTotalCost,
    extractPackageName,
} from "../src/Services/Packages/Scoring/CalcPackageCost";
import { afterEach, beforeEach, describe, it, expect, jest } from "@jest/globals";
import { getFetchSpy } from "./TestUtils/mocks";

const validPackageUrl = "https://github.com/facebook/react";
const invalidPackageUrl = "https://github.com/user/invalid-package";
const invalidPackageUrl2 = "https://github.com/user/";
const invalidPackageUrl3 = "hdwandawlndawdlnw";

const validPackageName = "react";

// PackagePhobia mock responses
const standaloneSizeMock = { publish: { bytes: 5242880 } }; // 5 MB
const totalSizeMock = { install: { bytes: 10485760 } }; // 10 MB

describe("CalcPackageCost functions", () => {
    beforeEach(() => {
        global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    // Use the facebook react package. That should be 0.3 MB when rounded in my function.
    describe("CalculateStandaloneCost", () => {
        // Use the invalid URL. This will give a 0 since cost was not calculated.
        it("should return 0 if the package URL is invalid", async () => {
            const result = await CalculateStandaloneCost(invalidPackageUrl);
            expect(result).toBe(0);
        });

        // This might occur if we do not have a npm package.
        it("should return 0 if fetching standalone cost fails", async () => {
            (global.fetch as jest.MockedFunction<typeof fetch>).mockRejectedValueOnce(
                new Error("Fetch error")
            );
            const result = await CalculateStandaloneCost(invalidPackageUrl);
            expect(result).toBe(0);
        });
    });

    // If we want dependencies in the request, we call the total cost function instead.
    // For facebook react, it is around 0.339 MB.
    describe("CalculateTotalCost", () => {
        // The calculate total cost should also give 0 if the URL is invalid.
        it("should return 0 if the package URL is invalid", async () => {
            const result = await CalculateTotalCost(invalidPackageUrl);
            expect(result).toBe(0);
        });

        // Also give 0 if the fetch had an error.
        it("should return 0 if fetching total cost fails", async () => {
            (global.fetch as jest.MockedFunction<typeof fetch>).mockRejectedValueOnce(
                new Error("Fetch error")
            );
            const result = await CalculateTotalCost(invalidPackageUrl);
            expect(result).toBe(0);
        });
    });

    describe("CalculateStandaloneCost", () => {
        it("should return 0 when package name cannot be extracted", async () => {
            const result = await CalculateStandaloneCost(invalidPackageUrl2); // Invalid URL
            expect(result).toBe(0);
        });

        it("should give an error during fetch", async () => {
            (global.fetch as jest.MockedFunction<typeof fetch>).mockRejectedValue(new Error("Fetch error"));
            const result = await CalculateStandaloneCost(validPackageUrl);
            expect(result).toBeGreaterThanOrEqual(0);
        });
    });

    describe("CalculateTotalCost", () => {
        it("should return 0 when package name cannot be extracted", async () => {
            const result = await CalculateTotalCost(invalidPackageUrl2); // Invalid URL
            expect(result).toBe(0);
        });

        it("should give an error during fetch", async () => {
            (global.fetch as jest.MockedFunction<typeof fetch>).mockRejectedValue(new Error("Fetch error"));
            const result = await CalculateTotalCost(validPackageUrl);
            expect(result).toBeGreaterThanOrEqual(0);
        });
    });

    describe("extractPackageName function", () => {
        it("should return package name for a valid GitHub URL", () => {
            const result = extractPackageName(validPackageUrl);
            expect(result).toBe(validPackageName); // Expected result is "react"
        });

        it("should return null for an invalid GitHub URL", () => {
            const result = extractPackageName(invalidPackageUrl3);
            expect(result).toBeNull();
        });
    });
});
