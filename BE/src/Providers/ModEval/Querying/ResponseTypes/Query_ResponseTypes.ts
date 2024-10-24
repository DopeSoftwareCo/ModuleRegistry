import { ContributorNode } from "../../GQL_Queries/QueryResponses/Contributors_ResponseTypes";
import { MergeCommitNode } from "../../GQL_Queries/QueryResponses/Merges_ResponseTypes";
import { PullRequestNode } from "../../GQL_Queries/QueryResponses/PR_ResponseTypes";
import { DependencyManifestNode } from "../../GQL_Queries/QueryResponses/Dependency_ResponseTypes";

export type ErrorLocation = {
    line: number;
    column: number;
};

export type ErrorLocations = ErrorLocation[];

export type GraphQLError = {
    type: string;
    path: string[];
    locations: ErrorLocations;
    message: string;
};

export interface GraphQLResponse<T> {
    data: T;
    errors?: GraphQLError[];
    message?: string;
    status?: string;
}

export type TestsFilesFromQuery = {
    name: string;
    type: string;
}[];

export type ContributorNodes = Array<ContributorNode>;
export type MergeCommitNodes = Array<MergeCommitNode>;
export type PullRequestNodes = Array<PullRequestNode>;
export type DependencyManifestNodes = Array<DependencyManifestNode>;

export type Query_RefType = { target?: { history: { edges?: [{ node: { author: { name: string } } }] } } };

export class RepoQueryResult {
    readonly repoName: string;
    readonly gitURL: string;
    readonly description: string;

    private license?: string | undefined;
    private openIssues: number | undefined;
    private stargazerCount: number | undefined;
    private contributors: ContributorNodes | undefined;
    private mergeData: MergeCommitNodes | undefined;
    private pullRequestData: PullRequestNodes | undefined;
    private dependencyData: DependencyManifestNodes | undefined;

    private ref: Query_RefType | undefined;
    private readmeFile: { text: string } | undefined;
    private testsCheckMain: { entries: TestsFilesFromQuery } | undefined;
    private testsCheckMaster: { entries: TestsFilesFromQuery } | undefined;

    constructor(params: {
        name: string;
        repoURL: string;
        description: string;
        license?: string;
        openIssues?: number;
        stargazerCount?: number;
        contributors?: ContributorNodes;
        mergeData?: MergeCommitNodes;
        pullRequestData?: PullRequestNodes;
        dependencyData?: DependencyManifestNodes;
        ref?: Query_RefType;
        readmeFile?: { text: string };
        testsCheckMain?: { entries: TestsFilesFromQuery };
        testsCheckMaster?: { entries: TestsFilesFromQuery };
    }) {
        this.repoName = params.name;
        this.gitURL = params.repoURL;
        this.description = params.description;
        this.license = params.license;
        this.openIssues = params.openIssues;
        this.stargazerCount = params.stargazerCount;
        this.contributors = params.contributors;
        this.mergeData = params.mergeData;
        this.pullRequestData = params.pullRequestData;
        this.dependencyData = params.dependencyData;
        this.ref = params.ref;
        this.readmeFile = params.readmeFile;
        this.testsCheckMain = params.testsCheckMain;
        this.testsCheckMaster = params.testsCheckMaster;
    }
    get Ref(): Query_RefType | undefined {
        return this.ref;
    }

    get RepoName(): string {
        return this.repoName;
    }
    get GitURL(): string {
        return this.gitURL;
    }
    get Description(): string {
        return this.description;
    }
    get License(): string | undefined {
        return this.license;
    }
    get OpenIssueCount(): number | undefined {
        return this.openIssues;
    }
    get StargazerCount(): number | undefined {
        return this.stargazerCount;
    }
    get Contributors(): ContributorNodes | undefined {
        return this.contributors;
    }
    get MergeData(): MergeCommitNodes | undefined {
        return this.mergeData;
    }
    get PullRequestData(): PullRequestNodes | undefined {
        return this.pullRequestData;
    }
    get DependencyData(): DependencyManifestNodes | undefined {
        return this.dependencyData;
    }
    get README(): { text: string } | undefined {
        return this.readmeFile;
    }
    get TestsCheck_Main(): { entries: TestsFilesFromQuery } | undefined {
        return this.testsCheckMain;
    }
    get TestsCheck_Master(): { entries: TestsFilesFromQuery } | undefined {
        return this.testsCheckMaster;
    }
}

/*
    NDJSONRow: Partial<{
        URL: string;
        NetScore: number;
        NetScore_Latency: number;
        RampUp: number;
        RampUp_Latency: number;
        Correctness: number;
        Correctness_Latency: number;
        BusFactor: number;
        BusFactor_Latency: number;
        ResponsiveMaintainer: number;
        ResponsiveMaintainer_Latency: number;
        License: number;
        License_Latency: number;
    }>;*/
