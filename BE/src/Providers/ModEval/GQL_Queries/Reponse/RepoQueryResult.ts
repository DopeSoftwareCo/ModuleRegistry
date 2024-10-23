import { Query_RefType, TestsFilesFromQuery } from "./RepoQueryResult.types";
import { MergeCommitNode } from "../Fields/Field_ResponseTypes/Merges_ResponseTypes";
import { PullRequestNode } from "../Fields/Field_ResponseTypes/PR_ResponseTypes";
import { DependencyManifestNode } from "../Fields/Field_ResponseTypes/Dependency_ResponseTypes";
import { CommitHistory } from "../Fields/Field_ResponseTypes/Commit_ResponseTypes";
import { LicenseInfo, RepositoryWithLicense } from "../Fields/Field_ResponseTypes/LicenseInfo_ResponseType";
import { MergeCommitNodes, PullRequestNodes, DependencyManifestNodes } from "./RepoQueryResult.types";

export class RepoQueryResult {
    public repoName: string;
    public gitURL: string;
    public description: string;
    public owner?: { login: string };
    public openIssues?: number;
    public closedIssues?: number;
    public licenseInfo?: LicenseInfo | undefined;
    public stargazerCount?: number | undefined;
    public forkCount?: number; // maps to `forkCount`
    public updatedAt?: string; // maps to `updatedAt`
    public pushedAt?: string; // maps to `pushedAt`
    public isPrivate?: boolean; // maps to `isPrivate`
    public isFork?: boolean; // maps to `isFork`
    public watchers?: number; // maps to `watchers.totalCount`
    public primaryLanguage?: { name: string }; // maps to `primaryLanguage.name`
    public languages?: { nodes: Array<{ name: string }> }; // maps to `languages.nodes`
    public vulnerabilityAlerts?: { nodes: Array<any> }; // maps to `vulnerabilityAlerts.nodes`
    public reactions?: { nodes: Array<any> }; // maps to `reactions.nodes`
    public commitHistory?: CommitHistory;
    public mergeData?: MergeCommitNodes;
    public dependencyData?: DependencyManifestNodes;
    public pullRequestData?: PullRequestNodes;
    public ref?: Query_RefType;
    public readmeFile?: { text: string };
    public testsCheckMain?: { entries: TestsFilesFromQuery };
    public testsCheckMaster?: { entries: TestsFilesFromQuery };

    constructor(params: {
        name: string;
        repoURL: string;
        description: string;
        owner?: { login: string };
        openIssues?: number;
        closedIssues?: number;
        licenseInfo?: LicenseInfo;
        stargazerCount?: number;
        forkCount?: number;
        updatedAt?: string;
        pushedAt?: string;
        isPrivate?: boolean;
        isFork?: boolean;
        watchers?: number;
        primaryLanguage?: { name: string };
        languages?: { nodes: Array<{ name: string }> };
        vulnerabilityAlerts?: { nodes: Array<any> };
        reactions?: { nodes: Array<any> };
        mergeData?: MergeCommitNodes;
        commitHistory?: CommitHistory;
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
        this.owner = params.owner;
        this.openIssues = params.openIssues;
        this.closedIssues = params.closedIssues;
        this.licenseInfo = params.licenseInfo;
        this.stargazerCount = params.stargazerCount;
        this.forkCount = params.forkCount;
        this.updatedAt = params.updatedAt;
        this.pushedAt = params.pushedAt;
        this.isPrivate = params.isPrivate;
        this.isFork = params.isFork;
        this.watchers = params.watchers;
        this.primaryLanguage = params.primaryLanguage;
        this.languages = params.languages;
        this.vulnerabilityAlerts = params.vulnerabilityAlerts;
        this.reactions = params.reactions;
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
    get Owner(): { login: string } | undefined {
        return this.owner;
    }
    get LicenseInfo(): LicenseInfo | undefined {
        return this.licenseInfo;
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

    get HistoryOfCommits(): CommitHistory | undefined {
        return this.commitHistory;
    }

    get ForkCount(): number | undefined {
        return this.forkCount;
    } // maps to `forkCount`
    get UpdatedAt(): string | undefined {
        return this.updatedAt;
    } // maps to `updatedAt`
    get PushedAt(): string | undefined {
        return this.pushedAt;
    }
    get IsPrivate(): boolean | undefined {
        return this.isPrivate;
    }
    get IsFork(): boolean | undefined {
        return this.isFork;
    }
    get WatcherCount(): number | undefined {
        return this.watchers;
    }
    get PrimaryLanguage(): { name: string } | undefined {
        return this.primaryLanguage;
    }
    get Languages(): { nodes: Array<{ name: string }> } | undefined {
        return this.languages;
    }
    get Reactions(): { nodes: Array<any> } | undefined {
        return this.reactions;
    }
    get VulnerabilityAlerts(): { nodes: Array<any> } | undefined {
        return this.vulnerabilityAlerts;
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
