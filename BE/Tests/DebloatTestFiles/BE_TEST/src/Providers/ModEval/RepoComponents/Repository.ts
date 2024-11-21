// Evaluate modules associated with string using 7 metrics
// takes in strings

import { RepoID } from './ID/RepoID';
import { RepoScoreset } from './Metrics_Scores/RepoScoreset';
import { EMPTY_REPO_NDJSON, NDJSONRow } from './NDJSON/NDJSONRow';
import { MetricName } from './Metrics_Scores/Metric.const';
import { GQLResultData } from '../GQL_Queries/Reponse/GQLResponse';

export class Repository {
    private id: RepoID;
    private scores: RepoScoreset;
    private queryResult: GQLResultData | undefined;
    private ndjson: NDJSONRow;
    private license: string = 'unknown';

    constructor(id: RepoID, scoreset?: RepoScoreset) {
        this.id = id;
        this.ndjson = EMPTY_REPO_NDJSON;
        this.scores = scoreset ? scoreset : new RepoScoreset();
        this.queryResult = undefined;
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
