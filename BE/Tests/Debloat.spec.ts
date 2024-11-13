import { beforeAll, describe, expect, test } from "@jest/globals";
import * as path from 'path';
import fs from 'fs';
import { debloatUnzippedContent } from "../src/DSinc_Modules/DSinc_PackageHandling"
/**
 * Requires the DebloatTestFiles folder
 */

const testDirectory = path.join(__dirname, "DebloatTestFiles");
describe("Debloat Test", () => {
    test("Test using BE as Input", async () => {
        const backendPath = path.join(testDirectory, "BE_TEST");
        const debloatedPath = backendPath + "_Debloated";
        await fs.promises.cp(backendPath, debloatedPath, { recursive: true });
        const isSuccessful = await debloatUnzippedContent(debloatedPath);
        expect(isSuccessful).toBe(true);
    },50000); // Times out after 50 seconds
});