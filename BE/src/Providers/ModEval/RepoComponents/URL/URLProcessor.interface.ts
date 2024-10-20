import { NullableArray } from "../../../../classes/Essential_Interfaces/NullableArray";

export interface PackageRepo_URL {
    providedURL: string;
    domain: string;
    tokens: NullableArray<string>;
}

export interface RepoURL extends PackageRepo_URL {
    gitURL: string;
}

export type RepoURLs = Array<RepoURL | undefined>;

export abstract class I_URLProcessor {
    public abstract Process(raw: string): Promise<RepoURL | undefined>;

    public abstract MultiProcess(urls: Array<string>, removingPadding: boolean): Promise<Array<RepoURL>>;

    protected abstract TryBuildValidRepoURL(raw: string): Promise<RepoURL | undefined>;

    public abstract IsTrackingHistory(): boolean;
    public abstract GetCreated(): Array<RepoURL> | undefined;
}
