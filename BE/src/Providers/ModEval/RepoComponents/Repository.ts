// Evaluate modules associated with string using 7 metrics
// takes in strings

import { RepoID } from "./ID/RepoID";
import { RepoScoreset } from "./Metrics_Scores/RepoScoreset";
import { RepoQueryResult } from "../GQL_Queries/Reponse/RepoQueryResult";
import { RepoQueryBuilder, SendRequestToGQL } from "../GQL_Queries/Requests/GQLRequests";
import { GraphQLResponse } from "../GQL_Queries/Reponse/RepoQueryResult.types";
import { EMPTY_REPO_NDJSON, NDJSONRow } from "./NDJSON/NDJSONRow";
import { MetricName } from "./Metrics_Scores/Metric.const";
import { Empty_CommitHistory } from "../GQL_Queries/Fields/Field_ResponseTypes/Commit_ResponseTypes";
import { Empty_LicenseInfo } from "../GQL_Queries/Fields/Field_ResponseTypes/LicenseInfo_ResponseType";
import { EmbeddedGQLData, GQLResultData } from "../GQL_Queries/Reponse/GQLResponse";

export class Repository {
    private id: RepoID;
    private scores: RepoScoreset;
    private queryResult: GQLResultData | undefined;
    private alreadyQueried: boolean = false;
    private ndjson: NDJSONRow;
    private license: string = "unknown";

    constructor(id: RepoID, scoreset?: RepoScoreset) {
        this.id = id;
        this.ndjson = EMPTY_REPO_NDJSON;
        this.scores = scoreset ? scoreset : new RepoScoreset();
        this.queryResult = undefined;
    }

    public async RequestFromGQL(): Promise<GQLResultData | undefined> {
        if (this.alreadyQueried) {
            return this.queryResult;
        }

        const queryString = RepoQueryBuilder([this.id]);
        const response = await SendRequestToGQL<EmbeddedGQLData>(queryString);

        if (!response) {
            return this.queryResult;
        }

        this.queryResult = response.data.repo0;
        this.alreadyQueried = true;

        if (!this.queryResult) {
            return this.queryResult;
        }

        const licenseName = this.queryResult.licenseInfo.name;
        this.license = licenseName ? licenseName : "???";
        return this.queryResult;
    }

    get License(): string {
        return this.license;
    }

    get ID(): RepoID {
        return this.id;
    }

    get QueryResult(): GQLResultData | undefined {
        return this.queryResult;
    }

    get Scores(): RepoScoreset {
        return this.scores;
    }

    set Scores(scoreset: RepoScoreset) {
        this.scores = scoreset;
    }

    public Refresh_NDJSON(): NDJSONRow {
        const scores = this.scores;
        this.ndjson = {
            URL: this.id.URL.providedURL,
            NetScore: this.scores.CurrentScore(),
            NetScore_Latency: scores.TimeSum(),
            RampUp: scores.GetMetricScore(MetricName.RampUpTime),
            RampUp_Latency: scores.GetMetricTime(MetricName.RampUpTime),
            Correctness: scores.GetMetricScore(MetricName.Correctness),
            Correctness_Latency: scores.GetMetricTime(MetricName.Correctness),
            BusFactor: scores.GetMetricScore(MetricName.BusFactor),
            BusFactor_Latency: scores.GetMetricTime(MetricName.BusFactor),
            ResponsiveMaintainer: scores.GetMetricScore(MetricName.MaintainerResponsiveness),
            ResponsiveMaintainer_Latency: scores.GetMetricTime(MetricName.MaintainerResponsiveness),
            License: scores.GetMetricScore(MetricName.LienseCompatibility),
            License_Latency: scores.GetMetricTime(MetricName.LienseCompatibility),
            VersionDependence: scores.GetMetricScore(MetricName.VersionDependence),
            VersionDependence_Latency: scores.GetMetricTime(MetricName.VersionDependence),
            MergeControl: scores.GetMetricScore(MetricName.PRMergeRestriction),
            MergeControl_Latency: scores.GetMetricTime(MetricName.PRMergeRestriction),
        };
        return this.ndjson;
    }
    public get NDJSONRow(): NDJSONRow {
        return this.ndjson;
    }
}
