// Evaluate modules associated with string using 7 metrics
// takes in strings

import { RepoID } from "./ID/RepoID";
import { RepoScoreset } from "../Scores/RepoScoreset";
import { RepoQueryResult } from "../GQL_Queries/CombinedResult/RepoQueryResult";
import { RepoQueryBuilder, SendRequestToGQL } from "../GQL_Queries/Builders/QueryBuilder";
import { GraphQLResponse } from "../GQL_Queries/CombinedResult/QueryResult.types";
import { NDJSONRow } from "./NDJSON/NDJSONRow";

export class Repository {
    private id: RepoID;
    private scores: RepoScoreset;
    private queryResult: RepoQueryResult | undefined;
    private queried: boolean = false;
    private license: string = "unknown";

    constructor(id: RepoID, scoreset?: RepoScoreset) {
        this.id = id;

        this.scores = scoreset ? scoreset : new RepoScoreset();
        this.queryResult = undefined;
    }

    public async SendQueryToGraphQL(): Promise<RepoQueryResult | undefined> {
        if (this.queried) {
            return this.queryResult;
        }

        const queryString = RepoQueryBuilder<RepoQueryResult>([this.id]);
        const response = await SendRequestToGQL<RepoQueryResult>(queryString);

        if (!response) {
            return this.queryResult;
        }
        this.queryResult = Adapt_GQLResponse_To_RepoQueryResult(response);
        this.queried = true;
    }

    get License(): string {
        return this.license;
    }

    get ID(): RepoID {
        return this.id;
    }

    get QueryResult(): RepoQueryResult | undefined {
        return this.queryResult;
    }

    get Scores(): RepoScoreset {
        return this.scores;
    }

    set Scores(scoreset: RepoScoreset) {
        this.scores = scoreset;
    }

    public NDJSONRow(): NDJSONRow | undefined {
        return undefined;
    }
}

export function Adapt_GQLResponse_To_RepoQueryResult(
    gql_response: GraphQLResponse<RepoQueryResult>
): RepoQueryResult {
    const data = gql_response.data;

    const repoQueryResult = new RepoQueryResult({
        name: data.RepoName,
        repoURL: data.GitURL,
        description: data.Description,
        license: data.License,
        openIssues: data.OpenIssueCount,
        stargazerCount: data.StargazerCount,
        contributors: data.Contributors,
        mergeData: data.MergeData,
        pullRequestData: data.PullRequestData,
        dependencyData: data.DependencyData,

        ref: data.Ref,
        readmeFile: data.README,
        testsCheckMain: data.TestsCheck_Main,
        testsCheckMaster: data.TestsCheck_Master,
    });
    return repoQueryResult;
}
