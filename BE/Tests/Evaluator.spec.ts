import { beforeAll, describe, expect, test } from "@jest/globals";
import {
    DEFAULT_WEIGHTS,
    WeightSpecSet,
} from "../src/Providers/ModEval/RepoComponents/Metrics_Scores/Weightspec.const";
import { ModuleEvaluator } from "../src/Providers/ModEval/ModuleEvaluator";
import { SuperRepoBuilder } from "../src/Providers/ModEval/RepoComponents/Builders/SuperRepoBuilder";
import { dummy_links, dummy_weightspecs } from "../src/Providers/ModEval/DevTools/DummyVals";
import { Repository } from "../src/Providers/ModEval/RepoComponents/Repository";
import { fail } from "assert";

const spec: WeightSpecSet = DEFAULT_WEIGHTS;
const evaluator = new ModuleEvaluator(spec);
const superbuilder = new SuperRepoBuilder();

describe("Subscores", () => {
    let a: Repository;
    let b: Repository;
    let c: Repository;
    let d: Repository;
    let e: Repository;

    beforeAll(async () => {
        const result_A = await superbuilder.SuperBuild("https://github.com/Headstorm/foundry-ui");
        const result_B = await superbuilder.SuperBuild("https://github.com/BellDorian/CapstoneResearch");
        const result_C = await superbuilder.SuperBuild("https://github.com/BellDorian/RepositoryEvaluator");
        const result_D = await superbuilder.SuperBuild("https://github.com/microsoft/vscode");
        const result_E = await superbuilder.SuperBuild("https://github.com/nodejs/node");

        if (!result_A || !result_B || !result_C || !result_D || !result_E) {
            fail("We cannot evaluate undefined repos!");
        }
        a = result_A;
        b = result_B;
        c = result_C;
        d = result_D;
        e = result_E;

        let repos = [a, b, c, d, e];
        await evaluator.MultiEval(repos);
    });

    /*test("RampUp Subscore", () => {
        expect(evaluator.rampUp.Score(a)).toBe(1);
        expect(evaluator.rampUp.Score(b)).toBe(0.5);
        expect(evaluator.rampUp.Score(c)).toBe(0.25);
        expect(evaluator.rampUp.Score(d)).toBe(0.125);
        expect(evaluator.rampUp.Score(e)).toBe(0);
    });*/

    /*test("Correctness Subscore", () => {
        expect(evaluator.correctness.Score(a)).toBe(1);
        expect(evaluator.correctness.Score(b)).toBe(0.5);
        expect(evaluator.correctness.Score(c)).toBe(0.25);
        expect(evaluator.correctness.Score(d)).toBe(0.125);
        expect(evaluator.correctness.Score(e)).toBe(0);
    });*/

    /*test("Bus Factor Subscore", () => {
        expect(evaluator.busFactor.Score(a)).toBe(1);
        expect(evaluator.busFactor.Score(b)).toBe(0.5);
        expect(evaluator.busFactor.Score(c)).toBe(0.25);
        expect(evaluator.busFactor.Score(d)).toBe(0.125);
        expect(evaluator.busFactor.Score(e)).toBe(0);
    });*/

    /*test("Maintainer Responsiveness Subscore", () => {
        expect(evaluator.responsiveness.Score(a)).toBe(1);
        expect(evaluator.responsiveness.Score(b)).toBe(0.5);
        expect(evaluator.responsiveness.Score(c)).toBe(0.25);
        expect(evaluator.responsiveness.Score(d)).toBe(0.125);
        expect(evaluator.responsiveness.Score(e)).toBe(0);
    });*/

    /*test("License Compatibility Subscore", () => {
        expect(evaluator.licensing.Score(a)).toBe(1);
        expect(evaluator.licensing.Score(b)).toBe(0.5);
        expect(evaluator.licensing.Score(c)).toBe(0.25);
        expect(evaluator.licensing.Score(d)).toBe(0.125);
        expect(evaluator.licensing.Score(e)).toBe(0);
    });*/

    /*test("Version Dependence Subscore", () => {
        expect(evaluator.versionDependence.Score(a)).toBe(1);
        expect(evaluator.versionDependence.Score(b)).toBe(0.5);
        expect(evaluator.versionDependence.Score(c)).toBe(0.25);
        expect(evaluator.versionDependence.Score(d)).toBe(0.125);
        expect(evaluator.versionDependence.Score(e)).toBe(0);
    });*/

    test("PR-Merge Control Subscore", () => {
        expect(evaluator.mergeRestriction.Score(a)).toBe(1);
        expect(evaluator.mergeRestriction.Score(b)).toBe(0.5);
        expect(evaluator.mergeRestriction.Score(c)).toBe(0.25);
        expect(evaluator.mergeRestriction.Score(d)).toBe(0.125);
        expect(evaluator.mergeRestriction.Score(e)).toBe(0);
    });
});

describe("SuperBuilder", () => {
    test("Handle A Mix of Valid and Invalid Links", async () => {
        let a = await superbuilder.MultiSuperBuild(dummy_links[0]);
        let b = await superbuilder.MultiSuperBuild(dummy_links[1]);
        let c = await superbuilder.MultiSuperBuild(dummy_links[2]);

        const failedBuild = a == undefined || b == undefined || c == undefined;
        expect(failedBuild).toBe(false);
        if (failedBuild) {
            fail("Could not handle a mix of valid and invalid links...");
        }

        expect(a.length).toBe(4);
        expect(b.length).toBe(8);
        expect(c.length).toBe(5);
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

    test("Verify That Query Results Store", async () => {
        const repo = await superbuilder.SuperBuild("https://github.com/verdaccio/verdaccio");
        if (repo?.QueryResult == undefined) {
            fail();
        }
        expect(repo.QueryResult.licenseInfo == undefined).toBe("MIT License");
    });
});
