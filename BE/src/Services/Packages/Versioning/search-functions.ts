import PackageModel, { Package } from "../../../Schemas/Package";
import { GetPackagesResponseBody } from "ResponseTypes";
import { UpdateType } from "./types";
import { GetRangeEndpoints, IncrementVersion, VersionType_RegExp } from "./utils";
import { GetPackagesData } from "RequestTypes";
import semver from "semver";
import { PackageMetaData } from "../../../Types/Models";

export function SortByVersion(unsorted: Package[], newestFirst: boolean = true): Package[] {
    if (newestFirst) {
        // Newest version first
        return unsorted.sort((left, right) => {
            return semver.lt(left.metadata.Version, right.metadata.Version) ? 1 : -1;
        });
    } else {
        // Oldest version first
        return unsorted.sort((left, right) => {
            return semver.gt(left.metadata.Version, right.metadata.Version) ? 1 : -1;
        });
    }
}

export namespace SearchVersion {
    export async function ByExact(title: string, filter: string): Promise<GetPackagesResponseBody> {
        let result: PackageMetaData[] = [];
        const matches = await PackageModel.find<Package>(
            { "metadata.Name": title, "metadata.Version": filter },
            { _id: 1, "metadata.Name": 1, "metadata.Version": 1 }
        );

        if (matches.length > 0) {
            result = matches.map((match) => ({
                ID: match._id.toString(),
                Name: match.metadata.Name,
                Version: match.metadata.Version,
            }));
        }
        return result;
    }

    export async function BySimpleRange(title: string, filter: string): Promise<GetPackagesResponseBody> {
        const rangeEndpoints = GetRangeEndpoints(filter);
        if (!rangeEndpoints) return [];
        try {
            const allVersions = await RetrieveAll(title);
            const matches: PackageMetaData[] = allVersions.filter((iteration) => {
                const version = iteration.Version;
                return (
                    semver.gte(version, rangeEndpoints.oldest) && semver.lte(version, rangeEndpoints.newest)
                );
            });

            return matches;
        } catch {
            return [];
        }
    }

    export async function RetrieveAll(
        title: string,
        sortByVersion: boolean = true,
        newestFirst: boolean = true
    ): Promise<GetPackagesResponseBody> {
        const allVersions = await PackageModel.find(
            { "metadata.Name": title },
            { _id: 1, "metadata.Name": 1, "metadata.Version": 1 }
        ).lean();

        if (sortByVersion) {
            SortByVersion(allVersions, newestFirst);
        }

        return allVersions.map<PackageMetaData>((doc) => ({
            ID: doc._id.toString(),
            Name: doc.metadata.Name,
            Version: doc.metadata.Version,
        }));
    }

    export async function ByTilde(title: string, filter: string): Promise<GetPackagesResponseBody> {
        try {
            const allVersions = await RetrieveAll(title);
            if (allVersions.length < 1) return [];

            const cleanFilter = filter.substring(1);
            const oldest = cleanFilter;
            const newest = IncrementVersion(cleanFilter, UpdateType.Minor);
            if (!newest) return [];

            const matches: PackageMetaData[] = allVersions.filter((iteration) => {
                const version = iteration.Version;
                return semver.gte(version, oldest) && semver.lt(version, newest);
            });

            return matches;
        } catch {
            return [];
        }
    }

    export async function ByCaret(title: string, filter: string): Promise<GetPackagesResponseBody> {
        try {
            const allVersions = await RetrieveAll(title);
            if (allVersions.length < 1) return [];

            const cleanFilter = filter.substring(1);
            const oldest = cleanFilter;
            const newest = IncrementVersion(cleanFilter, UpdateType.Major);
            if (!newest) return [];

            const matches: PackageMetaData[] = allVersions.filter((iteration) => {
                const version = iteration.Version;
                return semver.gte(version, oldest) && semver.lt(version, newest);
            });

            return matches;
        } catch {
            return [];
        }
    }
}

const searchByName = async (name: string): Promise<GetPackagesResponseBody> => {
    const result = await PackageModel.find({ "metadata.Name": name });
    if (result) {
        return result.map((foundP) => ({
            Version: foundP.metadata.Version,
            Name: foundP.metadata.Name,
            ID: foundP._id.toString(),
        }));
    }
    return [];
};

export async function FetchVersions(requests: GetPackagesData[]): Promise<GetPackagesResponseBody> {
    let versions: GetPackagesResponseBody = [];

    const response = requests.map((req) => ProcessSingleVersionRequest(req));
    const arrays = await Promise.all(response);

    arrays.forEach((arr) => {
        versions.push(...arr);
    });

    return versions;
}

export async function ProcessSingleVersionRequest(
    request: GetPackagesData
): Promise<GetPackagesResponseBody> {
    let result: GetPackagesResponseBody = [];
    const title = request.Name;
    //ternary bc i don't want it to be undefined or possibly a string
    const hasVersion = request.Version ? true : false;

    if (hasVersion) {
        const filter = request.Version.trim();
        const proceed = VersionType_RegExp.test(filter);
        if (proceed && hasVersion) {
            const symbol = filter[0];

            if (symbol === "~") {
                result = await SearchVersion.ByTilde(title, filter);
            } else if (symbol === "^") {
                result = await SearchVersion.ByCaret(title, filter);
            } else if (filter.includes("-")) {
                result = await SearchVersion.BySimpleRange(title, filter);
            } else {
                result = await SearchVersion.ByExact(title, filter);
            }
        }
    }

    if (!hasVersion) {
        result = await searchByName(title);
    }

    return result;
}
