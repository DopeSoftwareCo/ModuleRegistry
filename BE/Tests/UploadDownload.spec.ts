import { describe, expect, test } from "@jest/globals";
import { UploadInjestController } from "../src/Controllers/UploadInjestControllers.ts"
import { UploadInjestPackageRequest } from "../src/Types/RequestTypes/index.d";
import { UploadInjestNewPackageResponse } from "../src/Types/ResponseTypes/index.d";
import { NextFunction } from "express";

const urls_A = [
    "https://www.npmjs.com/package/typescript",
    "https://github.com/msys2/MINGW-packages",
    "https://www.npmjs.com/package/@docsearch/js",
    "https://github.com/orangeduck/mpc",
];

describe("Version Dependence", () => {
    test("Download Our Repo", async () => {
        const request: Partial<UploadI> = {
            body: 
        };
        UploadInjestController(Partial<>) 
        expect(test).toBe(1);
    });
});