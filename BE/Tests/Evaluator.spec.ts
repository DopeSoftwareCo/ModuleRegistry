import { beforeAll, describe, expect, test } from "@jest/globals";
import {
    DEFAULT_WEIGHTS,
    WeightSpecSet,
} from "../src/Providers/RepoEvaluator/RepoComponents/Metrics_Scores/Weightspec.const";
import { ModuleEvaluator } from "../src/Providers/RepoEvaluator/ModuleEvaluator";
import { SuperRepoBuilder } from "../src/Providers/RepoEvaluator/RepoComponents/Builders/SuperRepoBuilder";
import { dummy_links, dummy_weightspecs } from "../src/Providers/RepoEvaluator/DevTools/DummyVals";
import { Repository } from "../src/Providers/RepoEvaluator/RepoComponents/Repository";
import { fail } from "assert";

const spec: WeightSpecSet = DEFAULT_WEIGHTS;
const evaluator = new ModuleEvaluator(spec);
const superbuilder = new SuperRepoBuilder();

describe("SuperBuilder", () => {
    test("Handle A Mix of Valid and Invalid Links", async () => {
        let c = await superbuilder.MultiSuperBuild(dummy_links[2]);

        const failedBuild = c == undefined;
        expect(failedBuild).toBe(false);
        if (failedBuild) {
            fail("Could not handle a mix of valid and invalid links...");
        }
        // 2/5 links in the c set are invalid
        expect(c.length).toBe(3);
    });

    test("Single String -- Empty", async () => {
        let repo = await superbuilder.SuperBuild("");
        expect(repo).toBe(undefined);
    });

    test("Single String -- Blank", async () => {
        const repo = await superbuilder.SuperBuild("                    ");
        expect(repo).toBe(undefined);
    });

    test("Array of Strings -- Empty Array", async () => {
        const repoArr = await superbuilder.MultiSuperBuild([]);
        expect(repoArr).toBe(undefined);
    });

    test("Array of Strings -- Only Long Blanks", async () => {
        const repoArr = await superbuilder.MultiSuperBuild(["                  ", "                  "]);
        expect(repoArr).toBe(undefined);
    });

    // test("Verify That Query Results Store", async () => {
    //     const repo = await superbuilder.SuperBuild("https://github.com/verdaccio/verdaccio");
    //     console.error(repo);
    //     if (repo?.QueryResult?.licenseInfo == null) {
    //         fail();
    //     }
    //     expect(repo.QueryResult.licenseInfo.name).toBe("MIT License");
    // }, 10000);
});
