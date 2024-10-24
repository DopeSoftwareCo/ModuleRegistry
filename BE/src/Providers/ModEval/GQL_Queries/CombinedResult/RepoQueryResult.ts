import { Query_RefType, TestsFilesFromQuery } from "./QueryResult.types";
import { ContributorNode } from "../QueryResponses/Contributors_ResponseTypes";
import { MergeCommitNode } from "../QueryResponses/Merges_ResponseTypes";
import { PullRequestNode } from "../QueryResponses/PR_ResponseTypes";
import { DependencyManifestNode } from "../QueryResponses/Dependency_ResponseTypes";

export type ContributorNodes = Array<ContributorNode>;
export type MergeCommitNodes = Array<MergeCommitNode>;
export type PullRequestNodes = Array<PullRequestNode>;
export type DependencyManifestNodes = Array<DependencyManifestNode>;

export class RepoQueryResult {
    private readonly repoName: string;
    private readonly gitURL: string;
    private readonly description: string;

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
