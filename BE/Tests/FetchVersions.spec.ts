import { beforeAll, describe, expect, test } from "@jest/globals";
import { FakeMongo, fakeMongoFunctions, FillFakeMongo } from "./TestUtils/mocked_mongo";
import { fail } from "assert";

describe("Version Fetching", () => {
    beforeAll(() => {
        FillFakeMongo();
    });

    describe("Fetch ByExact Version", () => {
        test("Valid (Exact Version)", async () => {
            const request = [{ Name: "B1", Version: "5.7.4" }];
            let matches = await fakeMongoFunctions.FetchVersions(request);
            expect(matches.length).toBe(1);
        });
    });
});
