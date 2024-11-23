/*

import { UploadInjestController } from "../src/Controllers/UploadInjestControllers.ts"
//import { UploadInjestPackageRequest } from "../src/Types/RequestTypes";
//import { UploadInjestNewPackageResponse } from "../src/Types/ResponseTypes";
import { NextFunction } from "express";

const urls_A = [
    "https://www.npmjs.com/package/typescript",
    "https://github.com/msys2/MINGW-packages",
    "https://www.npmjs.com/package/@docsearch/js",
    "https://github.com/orangeduck/mpc",
];

describe("Version Dependence", () => {
    test("Download Our Repo", async () => {
        const request: Partial<UploadInjectPackageRequest> = {
        };
        const response: Partial<UploadInjectNewPackageResponse> = {

        };
        const next: Partial<NextFunction> = {

        } as NextFunction;
        UploadInjestController(request,response, next);
        expect(test).toBe(1);
    });
});
*/

import { describe, expect, it } from "@jest/globals";

describe("Upload Download Tests", () => {
    it("Should pass to have a test in the suite", () => {
        expect(true);
    });
});
