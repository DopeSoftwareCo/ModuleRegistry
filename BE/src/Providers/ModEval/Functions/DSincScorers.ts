import { Repository } from '../RepoComponents/Repository';
import { CreateTotalCommitsField, CreateReviewedPRField } from '../GQL_Queries/Fields/Fields';
import { SendRequestToGQL } from '../GQL_Queries/Requests/GQLRequests';
import {
    TotalCommitsResponse,
    PullRequestsResponse,
} from '../GQL_Queries/Fields/Field_ResponseTypes/PR_ResponseTypes';
import { ScoreBusFactor } from './BusFactor_Scorer';
import { ScoreCorrectness } from './Correctness_Scorer';
import { ScoreLicenseCompatibility } from './LicenseCompatibility';
import { ScoreRampupTime } from './RampUp';
import { ScoreReponsiveness } from './Responsiveness';

// Recall the enum ...
//VersionDependence = 5,
//PRMergeRestriction = 6,

// How crucial are each of these factors on a 1-7 scale?
/*
                   METRIC NAME      AN "IDEAL" SCORE IS
                ----------------------------------------
                 Ramp Up Time:      HIGH
                  Correctness:      HIGH
                   Bus Factor:      HIGH
    Maintainer Responsiveness:      HIGH
        License Compatibility:      == 1
           Version Dependency:       LOW        (Calculate this as the inverse of dependence, i.e. 1/dep)
         PR Merge Restriction:      HIGH

*/

export async function RampUp_Scorer(repo: Repository): Promise<number> {
    return ScoreRampupTime(repo);
}

export async function Correctness_Scorer(repo: Repository): Promise<number> {
    return ScoreCorrectness(repo);
}

export async function BusFactor_Scorer(repo: Repository): Promise<number> {
    return ScoreBusFactor(repo);
}

export async function Responsiveness_Scorer(repo: Repository): Promise<number> {
    return ScoreReponsiveness(repo);
}

export async function LicenseCompatibility_Scorer(repo: Repository): Promise<number> {
    return ScoreLicenseCompatibility(repo);
}

export async function VersionDependence_Scorer(repo: Repository): Promise<number> {
    let number_of_dependencies = repo.QueryResult?.dependencyGraphManifests?.nodes.length;
    if (number_of_dependencies == undefined) {
        return 1;
    }
    return 1 / (1 + number_of_dependencies / 2);
}

export async function MergeRestriction_Scorer(repo: Repository): Promise<number> {
    return 0;
    /*const Name = repo.ID.Name;
    const Owner = repo.ID.Owner;

    let prWithMultipleParents = 0;

    try {
        const pullRequests = await fetchAllPullRequests(Owner, Name);
        prWithMultipleParents = pullRequests.filter(
            (pr) => pr.mergeCommit && pr.mergeCommit.parents.totalCount >= 2
        ).length;
    } catch (error) {
        return 0;
    }

    let queryString = CreateTotalCommitsField(Owner, Name);
    let totalCommits = 0;
    try {
        const result = await SendRequestToGQL<TotalCommitsResponse>(queryString);
        if (result && result.data) {
            totalCommits = result.data.repository.object.history.totalCount;
        } else {
            return 0;
        }
    } catch (error) {
        return 0;
    }

    if (totalCommits === 0) {
        return 0;
    }

    const Score = prWithMultipleParents / totalCommits;
    const roundedScore = parseFloat(Score.toFixed(2));
    return roundedScore;*/
}

async function fetchAllPullRequests(owner: string, repoName: string): Promise<any[]> {
    let allPullRequests: any[] = [];
    let hasNextPage = true;
    let after: string | null = null;

    while (hasNextPage) {
        const queryString = CreateReviewedPRField(owner, repoName, after);
        try {
            const result = await SendRequestToGQL<PullRequestsResponse>(queryString);
            if (result && result.data) {
                const pullRequests = result.data.repository.pullRequests.nodes;
                allPullRequests = allPullRequests.concat(pullRequests);
                hasNextPage = result.data.repository.pullRequests.pageInfo.hasNextPage;
                after = result.data.repository.pullRequests.pageInfo.endCursor;
            } else {
                break;
            }
        } catch (error) {
            break;
        }
    }

    return allPullRequests;
}
