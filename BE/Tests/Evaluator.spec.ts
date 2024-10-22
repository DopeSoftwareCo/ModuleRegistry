import { beforeAll, describe, expect, test } from "@jest/globals";
import { DEFAULT_WEIGHTS, WeightSpecSet } from "../src/Providers/ModEval/Scores/Weightspec.const";
import { ModuleEvaluator } from "../src/Providers/ModEval/ModuleEvaluator";
import { SuperRepoBuilder } from "../src/Providers/ModEval/RepoComponents/SuperRepoBuilder";
import { dummy_links, dummy_weightspecs } from "../src/Providers/ModEval/DevTools/DummyVals";
import { Repository } from "../src/Providers/ModEval/RepoComponents/Repository";

const spec: WeightSpecSet = DEFAULT_WEIGHTS;
const evaluator = new ModuleEvaluator(spec);
const superbuilder = new SuperRepoBuilder();

describe("Subscores", () => {
    let a: Repository | undefined,
        b: Repository | undefined,
        c: Repository | undefined,
        d: Repository | undefined,
        e: Repository | undefined;

    beforeAll(async () => {
        const a = await superbuilder.SuperBuild("https://github.com/Headstorm/foundry-ui");
        const b = await superbuilder.SuperBuild("https://github.com/BellDorian/CapstoneResearch");
        const c = await superbuilder.SuperBuild("https://github.com/BellDorian/RepositoryEvaluator");
        const d = await superbuilder.SuperBuild("https://github.com/microsoft/vscode");
        const e = await superbuilder.SuperBuild("https://github.com/nodejs/node");
    });

    test("RampUp Subscore", () => {
        if (a && b && c && d && e) {
            expect(evaluator.rampUp.Score(a)).toBe(1);
            expect(evaluator.rampUp.Score(b)).toBe(0.5);
            expect(evaluator.rampUp.Score(c)).toBe(0.25);
            expect(evaluator.rampUp.Score(d)).toBe(0.125);
            expect(evaluator.rampUp.Score(e)).toBe(0);
        }
    });

    test("Correctness Subscore", () => {
        if (a && b && c && d && e) {
            expect(evaluator.correctness.Score(a)).toBe(1);
            expect(evaluator.correctness.Score(b)).toBe(0.5);
            expect(evaluator.correctness.Score(c)).toBe(0.25);
            expect(evaluator.correctness.Score(d)).toBe(0.125);
            expect(evaluator.correctness.Score(e)).toBe(0);
        }
    });

    test("Bus Factor Subscore", () => {
        if (a && b && c && d && e) {
            expect(evaluator.busFactor.Score(a)).toBe(1);
            expect(evaluator.busFactor.Score(b)).toBe(0.5);
            expect(evaluator.busFactor.Score(c)).toBe(0.25);
            expect(evaluator.busFactor.Score(d)).toBe(0.125);
            expect(evaluator.busFactor.Score(e)).toBe(0);
        }
    });

    test("Maintainer Responsiveness Subscore", () => {
        if (a && b && c && d && e) {
            expect(evaluator.responsiveness.Score(a)).toBe(1);
            expect(evaluator.responsiveness.Score(b)).toBe(0.5);
            expect(evaluator.responsiveness.Score(c)).toBe(0.25);
            expect(evaluator.responsiveness.Score(d)).toBe(0.125);
            expect(evaluator.responsiveness.Score(e)).toBe(0);
        }
    });

    test("License Compatibility Subscore", () => {
        if (a && b && c && d && e) {
            expect(evaluator.licensing.Score(a)).toBe(1);
            expect(evaluator.licensing.Score(b)).toBe(0.5);
            expect(evaluator.licensing.Score(c)).toBe(0.25);
            expect(evaluator.licensing.Score(d)).toBe(0.125);
            expect(evaluator.licensing.Score(e)).toBe(0);
        }
    });

    test("Version Dependence Subscore", () => {
        if (a && b && c && d && e) {
            expect(evaluator.versionDependence.Score(a)).toBe(1);
            expect(evaluator.versionDependence.Score(b)).toBe(0.5);
            expect(evaluator.versionDependence.Score(c)).toBe(0.25);
            expect(evaluator.versionDependence.Score(d)).toBe(0.125);
            expect(evaluator.versionDependence.Score(e)).toBe(0);
        }
    });

    test("PR-Merge Control Subscore", () => {
        if (a && b && c && d && e) {
            expect(evaluator.mergeRestriction.Score(a)).toBe(1);
            expect(evaluator.mergeRestriction.Score(b)).toBe(0.5);
            expect(evaluator.mergeRestriction.Score(c)).toBe(0.25);
            expect(evaluator.mergeRestriction.Score(d)).toBe(0.125);
            expect(evaluator.mergeRestriction.Score(e)).toBe(0);
        }
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
            return;
        }

        expect(a.length).toBe(4);
        expect(b.length).toBe(6);
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
});
