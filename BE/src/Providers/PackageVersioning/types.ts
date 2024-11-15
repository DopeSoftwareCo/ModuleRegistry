import { MongoPackage } from "../../Schemas/Package";

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
    projectID?: string;
    iterations: MongoPackage[];
}

export const EmptyProject: Project = { iterations: [] };

export interface CompletePackage extends MongoPackage {
    projectID?: string;
}

export type VersionRangeEndpoints = { earliest: string; latest: string };

/*  export function BuildObjectIds(idStrings: string[]): ObjectId[] {
        return idStrings.map((id) => {
            return new ObjectId(id);
        });
    }*/
