import * as dotenv from "dotenv"; //remove after testing
import { TargetRepository } from "../SingleClasses/TargetRepository";
import { Generate_RepositoryID } from "../Types/RepoIDTypes";
import { SendRequestToGQL } from "../Querying/Builders/QueryBuilder";
import { CreateReviewedPRField } from "../Querying/Builders/QueryFields";
import { CreateTotalCommitsField } from "../Querying/Builders/QueryFields";
import { TotalCommitsResponse, PullRequestsResponse } from "../Querying/ResponseTypes/PR_ResponseTypes";

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

export async function VersionDependence_Scorer(repo: TargetRepository): Promise<number> {
    // Placeholder for actual functionality
    let result = -1;
    return result;
}

export async function MergeRestriction_Scorer(repo: TargetRepository): Promise<number> {
    const owner = repo.Identifiers.owner;
    //console.log("owner:", owner);
    const repoName = repo.Identifiers.repoName;
    //console.log("repoName:", repoName);

    let prWithMultipleParents = 0;

    try {
        const pullRequests = await fetchAllPullRequests(owner, repoName);
        prWithMultipleParents = pullRequests.filter(
            (pr) => pr.mergeCommit && pr.mergeCommit.parents.totalCount >= 2
        ).length;
    } catch (error) {
        // console.error(`Error fetching pull requests for ${owner}/${repoName}:`, error);
        return 0;
    }

    let queryString = CreateTotalCommitsField(owner, repoName);
    let totalCommits = 0;
    try {
        const result = await SendRequestToGQL<TotalCommitsResponse>(queryString);
        if (result && result.data) {
            totalCommits = result.data.repository.object.history.totalCount;
        } else {
            // // console.error(
            //     `Result or result.data is undefined for total commits query in ${owner}/${repoName}`
            // );
            return 0;
        }
    } catch (error) {
        // console.error(`Error fetching total commits for ${owner}/${repoName}:`, error);
        return 0;
    }

    if (totalCommits === 0) {
        return 0;
    }

    const Score = (prWithMultipleParents / totalCommits) * 100;
    // console.log(`Score for ${owner}/${repoName}:`, Score + "%");
    const roundedScore = parseFloat(Score.toFixed(2));
    // console.log("prWithMultipleParents:", prWithMultipleParents);
    // console.log("totalCommits:", totalCommits);
    // console.log(`Score for ${owner}/${repoName}:`, roundedScore + "%");
    return roundedScore;
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

//-------------------------------------------------------------------------// Delete after testing
// dotenv.config();
// const envVarNames = ["GITHUB_TOKEN"];

// const url = "https://github.com";

// async function main() {
//     const repoID = await Generate_RepositoryID("https://github.com/cloudinary/cloudinary_npm");
//     if (repoID) {
//         const repo = new TargetRepository(repoID);
//         const result = await MergeRestriction_Scorer(repo);
//     } else {
//         return 0;
//     }
// }

// main();
