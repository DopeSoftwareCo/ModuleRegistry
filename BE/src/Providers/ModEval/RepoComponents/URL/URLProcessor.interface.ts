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
