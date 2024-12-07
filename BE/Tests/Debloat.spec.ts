import { describe, expect, test } from "@jest/globals";
import * as path from "path";
import fs from "fs";
import {
    debloatUnzippedContent,
    debloatZippedContent,
    zipContents,
} from "../src/Services/Packages/PackageZipHandling";
/**
 * Requires the DebloatTestFiles folder to run tests
 */

const testDirectory = path.join(__dirname, "DebloatTestFiles");
const timeout: number = 30000; // All tests time out after 50 seconds
const fileNameWithoutExtension = "BE_TEST";
const debloatedFileWithoutExtension = fileNameWithoutExtension + "_Debloated";
async function runDebloatTest(fileExtension: string): Promise<boolean> {
    const backendPath = path.join(testDirectory, fileNameWithoutExtension + fileExtension);
    const debloatedPath = path.join(testDirectory, debloatedFileWithoutExtension + fileExtension);
    let isSuccessful = false; // Assume failure
    try {
        if (fileExtension == "") {
            if (fs.existsSync(debloatedPath)) {
                // Cleans up previous test data if still there
                await fs.promises.rm(debloatedPath, { recursive: true, force: true });
            }
            await fs.promises.cp(backendPath, debloatedPath, { recursive: true });
            isSuccessful = await debloatUnzippedContent(debloatedPath);
        } else if (fileExtension.startsWith(".")) {
            if (fs.existsSync(debloatedPath)) {
                await fs.promises.rm(debloatedPath);
            }
            await fs.promises.copyFile(backendPath, debloatedPath);
            isSuccessful = await debloatZippedContent(debloatedPath);
        } // In all other situations, fail, since it must be a file extension
    } catch (error) {
        isSuccessful = false;
        console.error(error);
    }
    return isSuccessful;
}

describe("Debloat Test", () => {
    test(
        "Test using BE as Folder Input",
        async () => {
            expect(await runDebloatTest("")).toBe(true);
        },
        timeout
    );

    test(
        "Test using Zipped BE as tar.gz Input",
        async () => {
            // Might remove if functionality is not needed
            expect(await runDebloatTest(".tar.gz")).toBe(true);
        },
        timeout
    );
    test(
        "Test using Zipped BE as tar.gz Input",
        async () => {
            // Purposefully bad input, sees if it handles it.
            expect(await runDebloatTest("txt")).toBe(false);
        },
        timeout
    );
});

const compressThisFolder = path.join(testDirectory, "BE_TEST_Compression_Test");
describe("Compression Test", () => {
    test(
        "Zip Archive Test",
        async () => {
            expect(await zipContents(compressThisFolder, ".zip", compressThisFolder + "_ZIP_TEST.ZIP")).toBe(
                true
            );
        },
        timeout
    );
    test(
        "Tar Gz Archive Test",
        async () => {
            expect(
                await zipContents(compressThisFolder, ".tar.gz", compressThisFolder + "_targz_TEST.tar.gz")
            ).toBe(true);
        },
        timeout
    );
});
