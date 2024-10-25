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
    securityAdvisory: {
        severity: number;
    };

    // Adjust this based on the actual structure of the vulnerability alert nodes
    // For example, if they have a `message` or similar property
};

type ReactionNode = {
    // Adjust this based on the actual structure of the reaction nodes
    reactions: {
        nodes: {
            content: {
                user: {
                    login: string;
                };
            };
        };
    };
};

type ReadmeFile = {
    text: string;
};

type DependencyGraphManifestNode = {
    filename: {
        dependencies: {
            nodes: {
                packageName: string;
                requirements: string;
                hasDependencies: boolean;
                packageManager: string;
            };
        };
    };
    // Adjust this based on the actual structure of the dependency graph manifest nodes
};

type PullRequestEdge = {
    // Adjust this based on the actual structure of the pull request edges
    node: {
        id: string;
        title: string;
        number: number;
        body: any;
        createdAt: string;
        updatedAt: string;
        state: string;
        mergedAt: string;
        author: {
            login: string;
        };
        reviews: {
            nodes: {
                author: {
                    login: string;
                };
                state: any;
                submittedAt: string;
            };
        };
        commits: {
            nodes: {
                commit: {
                    oid: string;
                    message: string;
                    committedDate: string;
                    author: {
                        name: string;
                        email: string;
                    };
                };
            };
        };
    };
};

type TestsEntry = {
    // Define properties for test entries if applicable
    name: string;
};

export type GQLResultData = {
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

export type EmbeddedGQLData = {
    repo0: GQLResultData;
};

/*
export class GQL_Response
{
    private description: string;
    private repoName: string;
    private gitURL: string;
    private owner: Owner;
    private openIssues: IssuesCount;
    private closedIssues: IssuesCount;
    private licenseInfo: LicenseInfo;
    private stargazerCount: number;
    private forkCount: number;
    private updatedAt: string;
    private pushedAt: string;
    private isPrivate: boolean;
    private isFork: boolean;
    private watchers: Watchers;
    private primaryLanguage: PrimaryLanguage;
    private languages: { nodes: LanguageNode[] };
    private vulnerabilityAlerts: { nodes: VulnerabilityAlertNode[] };
    private reactions: { nodes: ReactionNode[] };
    private ref: { target: any }; // Adjust based on the actual structure of the ref object
    private readmeFile: ReadmeFile;
    private dependencyGraphManifests: { nodes: DependencyGraphManifestNode[] };
    private pullRequests: { edges: PullRequestEdge[] };
    private testsCheckMain: { entries: TestsEntry[] } | null; // Assuming it can be null
    private testsCheckMaster: { entries: TestsEntry[] } | null; // Assuming it can be null


  

    constructor(response: RepoResponse | undefined)
    {
        const data = response?.repo0;

        this.description = TryAssign<string>(data?.description," "); 
        this.repoName = TryAssign<string>(data?.name," "); 
        this.url: TryAssign<string>(data?.url," "); ;
        this.owner = TryAssign<Owner>(data?.owner,); 
        this.openIssues  = TryAssign<string>(data?.description," "); 
        this.closedIssues = TryAssign<number>(data?.description," "); 
        this.licenseInfo = TryAssign<LicenseInfo>(data?.description," "); 
        this.stargazerCount= TryAssign<string>(data?.description," "); 
        this.forkCount= TryAssign<string>(data?.description," "); 
        this.updatedAt = TryAssign<string>(data?.description," "); 
        this.isPrivate = TryAssign<string>(data?.description," "); 
        this.isFork = TryAssign<string>(data?.description," "); 
        this.watchers  = TryAssign<string>(data?.description,this.WatcherCount); 
        this.primaryLanguage = rTryAssign<string>(data?.description," ");
        this.languages: { nodes: LanguageNode[] },
        this.vulnerabilityAlerts: { nodes: VulnerabilityAlertNode[] },
        this.reactions: { nodes: ReactionNode[] },
        this.ref: { target: any }, // Adjust based on the actual structure of the ref object
        this.readmeFile: ReadmeFile,
        this.dependencyGraphManifests: { nodes: DependencyGraphManifestNode[] },
        this.pullRequests: { edges: PullRequestEdge[] },
        this.testsCheckMain: { entries: TestsEntry[] } | null,
        this.testsCheckMaster: { entries: TestsEntry[] } | null
    }





  

    get Description(): string {
        return this.description;
    }
    get RepoName(): string {
        return this.repoName;
    }
    get GitURL(): string {
        return this.gitURL;
    }
    get Owner(): { login: string } | undefined {
        return this.owner;
    }
    get OpenIssueCount(): number | undefined {
        return this.openIssues.totalCount;
    }
    
    get ClosedIssueCount(): number | undefined {
        return this.closedIssues.totalCount;
    }
    
    get LicenseInfo(): LicenseInfo | undefined {
        return this.licenseInfo;
    }
    get StargazerCount(): number | undefined {
        return this.stargazerCount;
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
    get Ref(): Query_RefType | undefined {
        return this.ref;
    }
    get README(): { text: string } | undefined {
        return this.readmeFile;
    }
    get DependencyData(): DependencyManifestNodes | undefined {
        return this.dependencyData;
    }
    get PullRequestData(): PullRequestNodes | undefined {
        return this.pullRequestData;
    }
    get TestsCheck_Main(): { entries: TestsFilesFromQuery } | undefined {
        return this.testsCheckMain;
    }
    get TestsCheck_Master(): { entries: TestsFilesFromQuery } | undefined {
        return this.testsCheckMaster;
    }
    get HistoryOfCommits(): CommitHistory | undefined {
        return this.commitHistory;
    }
    get MergeData(): MergeCommitNodes | undefined {
        return this.mergeData;
    }
}*/
