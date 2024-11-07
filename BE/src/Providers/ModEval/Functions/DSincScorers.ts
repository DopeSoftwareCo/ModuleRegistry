import { Repository } from "../RepoComponents/Repository";
import { CreatePRMergesField } from "../GQL_Queries/Fields/Fields";
import { SendRequestToGQL } from "../GQL_Queries/Requests/GQLRequests";

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
        throw new Error("Failed to fetch PR data");
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

    if (totalLOC === 0) {
        return 0;
    }

    const prMergeControlScore = reviewedLOC / totalLOC;
    const roundedScore = parseFloat(prMergeControlScore.toFixed(2));
    return roundedScore;
}
