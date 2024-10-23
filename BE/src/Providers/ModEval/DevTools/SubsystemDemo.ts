import { WeightSpec } from "../Scores/WeightSpec";
import { ModuleEvaluator } from "../ModuleEvaluator";
import { dummy_links, dummy_weightspecs } from "./DummyVals";
import { RepoID_Builder } from "../RepoComponents/ID/RepoID_Builder";
import { URLProcessor } from "../RepoComponents/URL/URLProcessor";
import { Repo_Builder } from "../RepoComponents/Repository_Builder";
import { DEFAULT_WEIGHTS, WeightSpecSet } from "../Scores/Weightspec.const";
import supertest from "supertest";
import { SuperRepoBuilder } from "../RepoComponents/SuperRepoBuilder";

export async function RunEvalSubsystemDemo(linkChoice: number = 0, specChoice: number = 0) {
    let urls: string[];
    let weights: WeightSpecSet;
    const id_builder = new RepoID_Builder();
    const processor = new URLProcessor();
    const repo_builder = new Repo_Builder();

    switch (linkChoice) {
        case 1:
            urls = dummy_links[0];
            break;
        case 2:
            urls = dummy_links[1];
            break;
        default:
            urls = dummy_links[2];
    }

    switch (specChoice) {
        case 1:
            weights = dummy_weightspecs[0];
            break;
        case 2:
            weights = dummy_weightspecs[1];
            break;
        case 3:
            weights = dummy_weightspecs[2];
            break;
        default:
            weights = DEFAULT_WEIGHTS;
    }

    const evaluator = new ModuleEvaluator(weights);

    /*console.log("--- #1: Building URLs ---");
    const repoURLs = await processor.MultiProcess(urls);

    console.log("--- #2 Making IDs---");
    const repoIDs = await id_builder.MultiBuild(repoURLs);

    if (!repoIDs) {
        console.log(" [x] FAILED TO BUILD IDs [x]");
        return;
    }

    console.log("--- #3 Assembling Repos ---");
    let repos = await repo_builder.MultiBuild_ByID(repoIDs);

    if (!repos) {
        console.log("[x] FAILED TO BUILD REPOSITORIES [X]");
        return;
    }

    //const response = await repos[4].RequestFromGQL();
    //console.log("--- GQL Response --- ");
    //console.log(response);
    //console.log("-----------------------------------------------------------");

    //await evaluator.MultiEval(repos);
    //repos.forEach((repo) => console.log(repo.QueryResult));*/
    const superB = new SuperRepoBuilder();
    const repo = await superB.SuperBuild(urls[3]);
    console.log("License: %s", repo?.License);
    console.log(repo?.NDJSONRow);

    console.log("========================= RESULT OF EVALUATION =========================");

    /* repos.forEach((repo) => {
        console.log("License: %s", repo.License);
        console.log(repo.NDJSONRow);
    });*/

    //repos.forEach((repo) => console.log(repo.QueryResult));
    //repos.forEach((repo) => console.log(repo.ID));
}
