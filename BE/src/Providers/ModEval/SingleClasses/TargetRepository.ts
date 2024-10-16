import { RepositoryIdentification, NDJSON_RowInfo } from "../Types/RepoIDTypes";
import { RepoQueryResult, GraphQLResponse } from "../Querying/ResponseTypes/Query_ResponseTypes";
import { RepoScoreSet, NetValue, EMPTY_SCOREINFO } from "../Types/ScoreTypes";
import { RepoQueryBuilder, SendRequestToGQL } from "../Querying/Builders/QueryBuilder";

const EXTRA_QUERY_FIELDS = ["contributors", "merges", "pullRequests", "dependencies"];

export class TargetRepository {
    private identifiers: RepositoryIdentification;
    private scores: RepoScoreSet;
    private queryResult: RepoQueryResult | undefined;
    private queried: boolean = false;
    private license: string = "unknown";

    constructor(id: RepositoryIdentification, scoreset?: RepoScoreSet) {
        this.identifiers = id;

        if (scoreset) {
            this.scores = scoreset;
        } else {
            this.scores = {
                rampup_score: EMPTY_SCOREINFO,
                correctness_score: EMPTY_SCOREINFO,
                busfactor_score: EMPTY_SCOREINFO,
                responsiveness_score: EMPTY_SCOREINFO,
                license_score: EMPTY_SCOREINFO,
                versionDependence_score: EMPTY_SCOREINFO,
                mergeRestriction_score: EMPTY_SCOREINFO,
                net: new NetValue(),
            };
        }
        this.queryResult = undefined;
    }

    public async SendQueryToGraphQL(): Promise<RepoQueryResult | undefined> {
        if (this.queried) {
            return this.queryResult;
        }

        const queryString = RepoQueryBuilder<RepoQueryResult>([this.Identifiers], EXTRA_QUERY_FIELDS);
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

    get Identifiers(): RepositoryIdentification {
        return this.identifiers;
    }

    get QueryResult(): RepoQueryResult | undefined {
        return this.queryResult;
    }

    get Scores(): RepoScoreSet {
        return this.scores;
    }

    set Scores(scoreset: RepoScoreSet) {
        this.scores = scoreset;
    }

    public NDJSONRow(): NDJSON_RowInfo | undefined {
        const row: NDJSON_RowInfo = {
            scores: this.scores,
            url: this.identifiers.url_info.gitURL,
        };
        return row;
    }
}

export function Adapt_GQLResponse_To_RepoQueryResult(gql_response: GraphQLResponse<RepoQueryResult>) {
    const data = gql_response.data;

    /*const repoQueryResult = new RepoQueryResult( 
    {
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
    return repoQueryResult;*/
    return data;
}
