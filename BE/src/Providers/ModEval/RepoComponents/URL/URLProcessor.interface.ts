export interface PackageRepo_URL {
    providedURL: string;
    domain: string;
    tokens?: Array<string>;
}

export interface RepoURL extends PackageRepo_URL {
    gitURL: string;
}

export type RepoURLs = Array<RepoURL | undefined>;
