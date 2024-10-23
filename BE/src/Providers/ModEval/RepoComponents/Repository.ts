// Evaluate modules associated with string using 7 metrics
// takes in strings

import { RepoID } from "./ID/RepoID";
import { RepoScoreset } from "../Scores/RepoScoreset";
import { RepoQueryResult } from "../GQL_Queries/Reponse/RepoQueryResult";
import { RepoQueryBuilder, SendRequestToGQL } from "../GQL_Queries/Requests/GQLRequests";
import { GraphQLResponse } from "../GQL_Queries/Reponse/RepoQueryResult.types";
import { EMPTY_REPO_NDJSON, NDJSONRow } from "./NDJSON/NDJSONRow";
import { MetricName } from "../Scores/Metric.const";
import { Empty_CommitHistory } from "../GQL_Queries/Fields/Field_ResponseTypes/Commit_ResponseTypes";
import { Empty_LicenseInfo } from "../GQL_Queries/Fields/Field_ResponseTypes/LicenseInfo_ResponseType";

export class Repository {
    private id: RepoID;
    private scores: RepoScoreset;
    private queryResult: RepoQueryResult | undefined;
    private queried: boolean = false;
    private ndjson: NDJSONRow;
    private license: string = "unknown";

    constructor(id: RepoID, scoreset?: RepoScoreset) {
        this.id = id;
        this.ndjson = EMPTY_REPO_NDJSON;
        this.scores = scoreset ? scoreset : new RepoScoreset();
        this.queryResult = undefined;
    }

    public async RequestFromGQL(): Promise<RepoQueryResult | undefined> {
        if (this.queried) {
            return this.queryResult;
        }

        const queryString = RepoQueryBuilder([this.id]);
        const response = await SendRequestToGQL<RepoQueryResult>(queryString);

        if (!response) {
            return this.queryResult;
        }
        this.queryResult = response.data;
        console.log(this.queryResult);
        this.queryResult = new RepoQueryResult(response.data);

        console.log("================= Result =================");
        console.log(this.queryResult instanceof RepoQueryResult);
        console.log(this.queryResult.LicenseInfo);
        console.log("==========================================");
        this.queried = true;

        if (!this.queryResult) {
            return this.queryResult;
        }

        const licenseName = this.queryResult.LicenseInfo?.name;

        this.license = licenseName ? licenseName : "???";
        return this.queryResult;
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

const EMPTY_QUERYRESULT = new RepoQueryResult({
    name: "Unknown name",
    repoURL: "Unknown url",
    description: "",
    licenseInfo: Empty_LicenseInfo,
    openIssues: -1,
    stargazerCount: -1,
    commitHistory: Empty_CommitHistory,
    mergeData: [],
    pullRequestData: [],
    dependencyData: [],

    ref: undefined,
    readmeFile: { text: "" },
    testsCheckMain: { entries: [] },
    testsCheckMaster: { entries: [] },
});

type LicenseInfo = {
    name: string;
    spdxId: string;
    url: string;
};

type Owner = {
    login: string;
};

type IssuesCount = {
    totalCount: number;
};

type Watchers = {
    totalCount: number;
};

type PrimaryLanguage = {
    name: string;
};

type LanguageNode = {
    // Adjust this based on the actual structure of the language nodes
    name: string;
};

type VulnerabilityAlertNode = {
    // Adjust this based on the actual structure of the vulnerability alert nodes
    // For example, if they have a `message` or similar property
};

type ReactionNode = {
    // Adjust this based on the actual structure of the reaction nodes
};

type ReadmeFile = {
    text: string;
};

type DependencyGraphManifestNode = {
    // Adjust this based on the actual structure of the dependency graph manifest nodes
};

type PullRequestEdge = {
    // Adjust this based on the actual structure of the pull request edges
};

type TestsEntry = {
    // Define properties for test entries if applicable
};

type RepoData = {
    description: string;
    name: string;
    url: string;
    owner: Owner;
    openIssues: IssuesCount;
    closedIssues: IssuesCount;
    licenseInfo: LicenseInfo;
    stargazerCount: number;
    forkCount: number;
    updatedAt: string;
    pushedAt: string;
    isPrivate: boolean;
    isFork: boolean;
    watchers: Watchers;
    primaryLanguage: PrimaryLanguage;
    languages: { nodes: LanguageNode[] };
    vulnerabilityAlerts: { nodes: VulnerabilityAlertNode[] };
    reactions: { nodes: ReactionNode[] };
    ref: { target: any }; // Adjust based on the actual structure of the ref object
    readmeFile: ReadmeFile;
    dependencyGraphManifests: { nodes: DependencyGraphManifestNode[] };
    pullRequests: { edges: PullRequestEdge[] };
    testsCheckMain: { entries: TestsEntry[] } | null; // Assuming it can be null
    testsCheckMaster: { entries: TestsEntry[] } | null; // Assuming it can be null
};

type RepoResponse = {
    repo0: RepoData;
};

// Example of how to use the type
//const response: RepoResponse = {
// ... your response structure here };
