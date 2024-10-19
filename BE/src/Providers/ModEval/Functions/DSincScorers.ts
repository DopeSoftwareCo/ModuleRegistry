import { TargetRepository, Adapt_GQLResponse_To_RepoQueryResult } from "../SingleClasses/TargetRepository";

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
    const queryResult = await repo.SendQueryToGraphQL();
    if (!queryResult) {
        return -1;
    }

    const totalCommits = repo.TotalCommits;
    const reviewedPRCommits = repo.TotalPullRequestsWithReview;

    // console.log("Total commits: " + totalCommits);
    // console.log("Reviewed PR commits: " + reviewedPRCommits);

    if (totalCommits === 0) {
        return 0;
    }

    const fractionReviewed = reviewedPRCommits / totalCommits;
    return fractionReviewed * 7; // Scale to 1-7
}
