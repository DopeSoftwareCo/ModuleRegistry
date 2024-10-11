/* The topmost class in the design */

import { Evaluator } from "./SingleClasses/Evaluator";
import { WeightSpec } from "./SingleClasses/WeightSpec";
import { AsyncForEach, AsyncForEach_AndStore } from "../../DSinc_Modules/DSinc_LoopsMaps";
import * as Dummy from "../ModEval/DevTools/DummyVals";
import { NetValue } from "./Types/ScoreTypes";
import { BuildTargetRepo, TryBuildTargetRepo } from "./Functions/RepoBuilder";
import { TargetRepository } from "./SingleClasses/TargetRepository";
import { URLProcessor } from "./SingleClasses/URLProcessor";
import { Generate_RepositoryID } from "./Types/RepoIDTypes";

export type Targets = Array<TargetRepository>;

export async function ModEval(code: number) {
    let spec: Array<WeightSpec>;
    let urls: Array<string>;

    if (code == 1) {
        spec = [
            Dummy.wspec_A0,
            Dummy.wspec_A1,
            Dummy.wspec_A2,
            Dummy.wspec_A3,
            Dummy.wspec_A4,
            Dummy.wspec_A5,
            Dummy.wspec_A6,
        ];
        urls = [Dummy.url_A0, Dummy.url_A1, Dummy.url_A2, Dummy.url_A3];
    } else if (code == 2) {
        spec = [
            Dummy.wspec_B0,
            Dummy.wspec_B1,
            Dummy.wspec_B2,
            Dummy.wspec_B3,
            Dummy.wspec_B4,
            Dummy.wspec_B5,
            Dummy.wspec_B6,
        ];
        urls = [Dummy.url_B0, Dummy.url_B1, Dummy.url_B2, Dummy.url_B3, Dummy.url_B4];
    } else code == 3;
    {
        spec = [
            Dummy.wspec_C0,
            Dummy.wspec_C1,
            Dummy.wspec_C2,
            Dummy.wspec_B3,
            Dummy.wspec_C4,
            Dummy.wspec_C5,
            Dummy.wspec_C6,
        ];
        urls = [Dummy.url_C0, Dummy.url_C1, Dummy.url_C2];
    }
    // Dummy specsets

    let evaluator = new Evaluator(spec);

    let repoID1 = await Generate_RepositoryID(urls[0]);
    let repoID2 = await Generate_RepositoryID(urls[1]);

    let repo1: (TargetRepository | undefined) = undefined;
    let repo2: (TargetRepository | undefined) = undefined;
    
    if(repoID1)
    {
        let repo1 = new TargetRepository(repoID1);
        await evaluator.Eval(repo1);
    }
    if(repoID2)
    {
        let repo2 = new TargetRepository(repoID2);
        await evaluator.Eval(repo2);
    }

    console.log(repo1, repo2);
}

export async function BuildTargets(rawUrls: Array<string>): Promise<Targets> {
    let targets: Targets = new Array<TargetRepository>();
    await AsyncForEach_AndStore<string, TargetRepository>(rawUrls, targets, BuildTargetRepo, true);
    return targets;
}