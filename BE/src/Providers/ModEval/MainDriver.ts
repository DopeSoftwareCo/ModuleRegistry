/* The topmost class in the design */

import { Evaluator } from "./SingleClasses/Evaluator";
import { WeightSpec } from "./SingleClasses/WeightSpec";
import {
    AsyncForEach,
    AsyncForEach_AndStore,
    AsyncForEach_StoreDefined,
} from "../../DSinc_Modules/DSinc_LoopsMaps";
import * as Dummy from "../ModEval/DevTools/DummyVals";
import { NetValue, SubscoreName } from "./Types/ScoreTypes";
import { BuildTargetRepo, TryBuildTargetRepo } from "./Functions/RepoBuilder";
import { TargetRepository } from "./SingleClasses/TargetRepository";
import { URLProcessor } from "./SingleClasses/URLProcessor";
import { Generate_RepositoryID, RepositoryIdentification } from "./Types/RepoIDTypes";
import { SendRequestToGQL } from "./Querying/Builders/QueryBuilder";

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
    } else {
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

    const linkA = "https://github.com/torvalds/linux";
    const linkB = "https://www.npmjs.com/package/@template-tools/temlate-sync";
    const linkC = "https://www.npmjs.com/package/javadoc";

    const wspec0 = new WeightSpec(SubscoreName.RampUpTime, 0.2);
    const wspec1 = new WeightSpec(SubscoreName.Correctness, 0.4);
    const wspec2 = new WeightSpec(SubscoreName.BusFactor, 0.6);
    const wspec3 = new WeightSpec(SubscoreName.MaintainerResponsiveness, 0.8);
    const wspec4 = new WeightSpec(SubscoreName.LienseCompatibility, 1.0);
    const wspec5 = new WeightSpec(SubscoreName.VersionDependence, 1.2);
    const wspec6 = new WeightSpec(SubscoreName.PRMergeRestriction, 1.4);

    let evaluator = new Evaluator([wspec0, wspec1, wspec2, wspec3, wspec4, wspec5, wspec6]);
    console.log(evaluator);

    let target = await BuildRepos([urls[0]]);
    console.log(target[0]);

    await evaluator.Eval(target[0]);

    //const x = await evaluator.correctness.Score(target[0]);

    console.log(target[0].Scores);
    //let targets = await BuildRepos(urls);
    //await targets[0].SendQueryToGraphQL();

    //evaluator.MultiEval(targets);

    //console.log("RESULT");
    //console.log(targets[0]);
    console.log("Final Score ....");
    console.log(target[0].Scores.net.CurrentScore());
}

type TargetsNulls = Array<TargetRepository | undefined>;
export async function BuildRepos(rawUrls: Array<string>): Promise<Targets> {
    let targets = new Array<TargetRepository>();

    await AsyncForEach_StoreDefined<string, TargetRepository>(rawUrls, targets, BuildTarget, true);
    return targets;
}

export async function BuildTarget(raw: string): Promise<TargetRepository | undefined> {
    let id = await Generate_RepositoryID(raw);
    if (id) {
        return new TargetRepository(id);
    }

    return undefined;
}
