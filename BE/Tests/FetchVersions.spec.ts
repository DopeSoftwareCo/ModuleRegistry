import { beforeAll, describe, expect, test } from "@jest/globals";
import { FakeMongo, fakeMongoFunctions, FillFakeMongo } from "./TestUtils/mocked_mongo";
import { fail } from "assert";

describe("Version Fetching", () => {
    beforeAll(() => {
        FillFakeMongo();
    });

    describe("Fetch w/ VALID input", () => {
        test("(Valid) Exact Version", async () => {
            const request = [{ Name: "B1", Version: "5.7.4" }];
            let matches = await fakeMongoFunctions.FetchVersions(request);
            expect(matches.length).toBe(1);
        });
        test("(Valid) Simple Range", async () => {
            const request = [{ Name: "A1", Version: "1.0.0-10.0.0" }];
            let matches = await fakeMongoFunctions.FetchVersions(request);
            expect(matches.length).toBe(9);
        });
    });
});
