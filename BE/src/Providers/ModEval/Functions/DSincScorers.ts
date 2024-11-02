import { Repository } from "../RepoComponents/Repository";
import { CreatePRMergesField } from "../GQL_Queries/Fields/Fields";
import { SendRequestToGQL } from "../GQL_Queries/Requests/GQLRequests";
import {
    TotalCommitsResponse,
    PullRequestsResponse,
} from "../GQL_Queries/Fields/Field_ResponseTypes/PR_ResponseTypes";
import { ScoreBusFactor } from "./BusFactor_Scorer";
import { ScoreCorrectness } from "./Correctness_Scorer";
import { ScoreLicenseCompatibility } from "./LicenseCompatibility";
import { ScoreRampupTime } from "./RampUp";
import { ScoreReponsiveness } from "./Responsiveness";

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
    const Name = repo.ID.Name;
    const Owner = repo.ID.Owner;
    let queryString = CreatePRMergesField(Owner, Name);

    const prData = (await SendRequestToGQL(queryString)) as {
        data: {
            repository: { pullRequests: { nodes: { additions: number; reviews: { totalCount: number } }[] } };
        };
    };
    if (!prData || !prData.data.repository || !prData.data.repository.pullRequests) {
        console.error("Invalid PR data:", prData);
        throw new Error("Failed to fetch pull requests data");
    }

    let totalLOC = 0;
    let reviewedLOC = 0;

    prData.data.repository.pullRequests.nodes.forEach((pr) => {
        const additions = pr.additions;
        totalLOC += additions;
        if (pr.reviews.totalCount > 0) {
            reviewedLOC += additions;
        }
    });

    const prMergeControlScore = reviewedLOC / totalLOC;
    const roundedScore = parseFloat(prMergeControlScore.toFixed(2));
    return roundedScore;
}
