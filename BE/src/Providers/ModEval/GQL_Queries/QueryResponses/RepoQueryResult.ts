import { Query_RefType, TestsFilesFromQuery } from "../Reponse/RepoQueryResult.types";
import { MergeCommitNode } from "../Fields/Field_ResponseTypes/Merges_ResponseTypes";
import { PullRequestNode } from "../Fields/Field_ResponseTypes/PR_ResponseTypes";
import { DependencyManifestNode } from "../Fields/Field_ResponseTypes/Dependency_ResponseTypes";

export type MergeCommitNodes = Array<MergeCommitNode>;
export type PullRequestNodes = Array<PullRequestNode>;
export type DependencyManifestNodes = Array<DependencyManifestNode>;

export class RepoQueryResult {
    readonly repoName: string;
    readonly gitURL: string;
    readonly description: string;

    private license?: string | undefined;
    private openIssues: number | undefined;
    private closedIssues: number | undefined;
    private stargazerCount: number | undefined;
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
        closedIssues?: number;
        stargazerCount?: number;
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
        this.closedIssues = params.closedIssues;
        this.stargazerCount = params.stargazerCount;
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

    get ClosedIssueCount(): number | undefined {
        return this.closedIssues;
    }

    get StargazerCount(): number | undefined {
        return this.stargazerCount;
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
