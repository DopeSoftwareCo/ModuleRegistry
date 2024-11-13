import { beforeAll, describe, expect, test } from "@jest/globals";
import * as path from 'path';
import fs from 'fs';
import { debloatUnzippedContent, debloatZippedContent } from "../src/DSinc_Modules/DSinc_PackageHandling"
/**
 * Requires the DebloatTestFiles folder
 */

const testDirectory = path.join(__dirname, "DebloatTestFiles");
const timeout: number = 50000;
const fileNameWithoutExtension = "BE_TEST";
const debloatedFileWithoutExtension = fileNameWithoutExtension + "_Debloated"
describe("Debloat Test", () => {
    test("Test using BE as Folder Input", async () => {
        const backendPath = path.join(testDirectory, fileNameWithoutExtension);
        const debloatedPath = path.join(backendPath, debloatedFileWithoutExtension);
        await fs.promises.cp(backendPath, debloatedPath, { recursive: true });
        const isSuccessful = await debloatUnzippedContent(debloatedPath);
        expect(isSuccessful).toBe(true);
    },timeout); // Times out after 50 seconds
    test("Test using Zipped BE as .zip Input", async () => {
        const fileExtension = ".zip";
        const backendPath = path.join(testDirectory, fileNameWithoutExtension + fileExtension);
        const debloatedPath = path.join(backendPath, debloatedFileWithoutExtension + fileExtension);
        await fs.promises.copyFile(backendPath, debloatedPath);
        const isSuccessful = await debloatZippedContent(debloatedPath);
        expect(isSuccessful).toBe(true);
    },timeout)
    test("Test using Zipped BE as tar.gz Input", async () => { // Might remove
        const fileExtension = ".tar.gz";
        const backendPath = path.join(testDirectory, fileNameWithoutExtension + fileExtension);
        const debloatedPath = path.join(backendPath, debloatedFileWithoutExtension + fileExtension);
        //await fs.promises.copyFile(backendPath, debloatedPath);
        //const isSuccessful = await debloatZippedContent(debloatedPath);
        //expect(isSuccessful).toBe(true);
    },timeout)
});