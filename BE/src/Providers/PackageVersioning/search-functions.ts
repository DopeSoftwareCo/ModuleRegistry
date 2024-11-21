import PackageModel, { Package } from "../../Schemas/Package";
import { GetPackagesResponseBody } from "ResponseTypes";
import { UpdateType } from "./types";
import { GetRangeEndpoints, IncrementVersion, VersionType_RegExp } from "./utils";
import { GetPackagesData } from "RequestTypes";
import semver from "semver";
import { APIPackageMetaData } from "../../Types/Models";

export namespace SearchVersion {
    export async function ByExact(title: string, filter: string): Promise<GetPackagesResponseBody> {
        let result: APIPackageMetaData[] = [];
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

            const matches: APIPackageMetaData[] = allVersions.filter((iteration) => {
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

    export async function RetrieveAll(title: string): Promise<GetPackagesResponseBody> {
        const allVersions = await PackageModel.find(
            { "metadata.Name": title },
            { _id: 1, "metadata.Name": 1, "metadata.Version": 1 }
        ).lean();

        return allVersions.map<APIPackageMetaData>((doc) => ({
            ID: doc._id.toString(),
            Name: doc.metadata.Name,
            Version: doc.metadata.Version,
        }));
    }

    export async function ByTilde(title: string, filter: string): Promise<GetPackagesResponseBody> {
        try {
            const allVersions = await RetrieveAll(title);
            if (allVersions.length < 1) return [];

            const oldest = filter;
            const newest = IncrementVersion(filter, UpdateType.Minor);
            if (!newest) return [];

            const matches: APIPackageMetaData[] = allVersions.filter((iteration) => {
                const version = iteration.Version;
                return semver.gte(version, oldest) && semver.lte(version, newest);
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

            const oldest = filter;
            const newest = IncrementVersion(filter, UpdateType.Major);
            if (!newest) return [];

            const matches: APIPackageMetaData[] = allVersions.filter((iteration) => {
                const version = iteration.Version;
                return semver.gte(version, oldest) && semver.lte(version, newest);
            });

            return matches;
        } catch {
            return [];
        }
    }
}

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
    const filter = request.Version.trim();
    const proceed = VersionType_RegExp.test(filter);

    if (proceed) {
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

    return result;
}
