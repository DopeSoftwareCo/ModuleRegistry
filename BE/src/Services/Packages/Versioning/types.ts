import { Package } from "../../../Schemas/Package";
import { PackageMetaData } from "../../../Types/Models";

export enum UpdateType {
    Major = 0,
    Minor = 1,
    Patch = 2,
}

export enum SearchType {
    Exact = 0,
    SimpleRange = 1,
    Regex = 2,
    Tilde = 3,
    Carat = 4,
}

export interface Project {
    projectID: string;
    iterations: Package[];
}

export const EmptyProject: Project = { projectID: "", iterations: [] };

export interface CompletePackage extends Package {
    projectID?: string;
}

export type VersionRangeEndpoints = { oldest: string; newest: string };
export type VersionPartitons = Array<PackageMetaData[]>;
export const PAGE_SIZE = 5;
