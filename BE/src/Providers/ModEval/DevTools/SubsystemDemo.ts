import { ModuleEvaluator } from '../ModuleEvaluator';
import { dummy_links, dummy_weightspecs } from './DummyVals';
import { RepoID_Builder } from '../RepoComponents/ID/RepoID_Builder';
import { URLProcessor } from '../RepoComponents/URL/URLProcessor';
import { Repo_Builder } from '../RepoComponents/Builders/Repository_Builder';
import { DEFAULT_WEIGHTS, WeightSpecSet } from '../RepoComponents/Metrics_Scores/Weightspec.const';
import { SuperRepoBuilder } from '../RepoComponents/Builders/SuperRepoBuilder';

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
    const superB = new SuperRepoBuilder();
    let repos = await superB.MultiSuperBuild(urls);

    if (!repos) {
        console.log('[x] FAILED TO BUILD REPOSITORIES [X]');
        return;
    }
    await evaluator.MultiEval(repos);

    console.log('========================= RESULT OF EVALUATION =========================');

    repos.forEach((repo) => {
        console.log(repo.NDJSONRow);
    });
}
