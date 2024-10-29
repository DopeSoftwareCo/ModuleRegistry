import { MergeCommitNode, MergeCommitQueryResult } from "../Fields/Field_ResponseTypes/Merges_ResponseTypes";
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

export type DependencyGraphManifestNode = {
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
    commitHistory: MergeCommitQueryResult | null;
};

export type EmbeddedGQLData = {
    repo0: GQLResultData;
};
