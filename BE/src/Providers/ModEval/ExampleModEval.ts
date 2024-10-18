/* The topmost class in the design */

import { WeightSpec } from "./Scores/WeightSpec";
import { ModuleEvaluator } from "./ModuleEvaluator";
import {
    WeightSpectSet_A,
    WeightSpectSet_B,
    WeightSpectSet_C,
    urlset_A,
    urlset_B,
    urlset_C,
} from "./DevTools/DummyVals";
import { RepoID_Builder } from "./RepoComponents/ID/RepoID_Builder";
import { URLProcessor } from "./RepoComponents/URL/URLProcessor";
import { Repo_Builder } from "./RepoComponents/Repository_Builder";

export async function Demo(code: number) {
    let spec: Array<WeightSpec>;
    let urls = urlset_A;

    // Dummy specsets

    const linkA = "https://github.com/torvalds/linux";
    const linkB = "https://www.npmjs.com/package/@template-tools/temlate-sync";
    const linkC = "https://www.npmjs.com/package/javadoc";

    console.log("Final Score ....");
    //console.log(y.CurrentScore());
    const weights = WeightSpectSet_A;
    const x = new ModuleEvaluator(weights);
    const id_builder = new RepoID_Builder();
    const processor = new URLProcessor();
    const repo_builder = new Repo_Builder();

    const repoURLs = await processor.MultiProcess(urls);
    const repoIDs = await id_builder.MultiBuild(repoURLs);

    if (!repoIDs) {
        console.log("Failed to produce any RepoIDs!");
        return;
    }

    let repos = await repo_builder.MultiBuild_ByID(repoIDs);
    if (!repos) {
        console.log("Failed to build any Repositories!");
        return;
    }

    x.MultiEval(repos);

    console.log("========================= RESULT OF EVALUATION =========================");

    repos.forEach((repo) => console.log(repo.Scores));
    //console.log(repoIDs)
}
