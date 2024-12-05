import PackageModel, { Package } from "../../../Schemas/Package";
import { GetPackagesResponseBody } from "ResponseTypes";
import { PAGE_SIZE, UpdateType, VersionPartitons } from "./types";
import { GetRangeEndpoints, IncrementVersion, SortByVersion, VersionType_RegExp } from "./utils";
import { GetPackagesData } from "RequestTypes";
import semver from "semver";
import { PackageMetaData } from "../../../Types/Models";
import { PartitionArray } from "../../../Utils/DSinc/Array";

export namespace SearchVersion {
    export async function ProcureAllVersionsWithPartition(
        title: string,
        sortByVersion: boolean = true,
        newestFirst: boolean = true,
        pageSize: number = PAGE_SIZE
    ): Promise<GetPackagesResponseBody[]> {
        const versionsOfThis = await PackageModel.find(
            { "metadata.Name": title },
            { _id: 1, "metadata.Name": 1, "metadata.Version": 1 }
        ).lean();

        if (sortByVersion) {
            SortByVersion(versionsOfThis, newestFirst);
        }

        const sortedPackages = versionsOfThis.map<PackageMetaData>((doc) => ({
            ID: doc._id.toString(),
            Name: doc.metadata.Name,
            Version: doc.metadata.Version,
        }));

        return PartitionArray<PackageMetaData>(sortedPackages, pageSize);
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
            const versionsOfThis = await RetrieveAll(title);

            const matchingVersions: PackageMetaData[] = versionsOfThis.filter((iteration) => {
                const version = iteration.Version;
                return (
                    semver.gte(version, rangeEndpoints.oldest) && semver.lte(version, rangeEndpoints.newest)
                );
            });

            return matchingVersions;
        } catch {
            return [];
        }
    }

    export async function ByTilde(title: string, filter: string): Promise<GetPackagesResponseBody> {
        try {
            const versionsOfThis = await RetrieveAll(title);
            if (versionsOfThis.length < 1) return [];

            const cleanFilter = filter.substring(1);
            const oldest = cleanFilter;
            const newest = IncrementVersion(cleanFilter, UpdateType.Minor);
            if (!newest) return [];

            const matchingVersions: PackageMetaData[] = versionsOfThis.filter((iteration) => {
                const version = iteration.Version;
                return semver.gte(version, oldest) && semver.lt(version, newest);
            });

            return matchingVersions;
        } catch {
            return [];
        }
    }

    export async function ByCaret(title: string, filter: string): Promise<GetPackagesResponseBody> {
        try {
            const versionsOfThis = await RetrieveAll(title);
            if (versionsOfThis.length < 1) return [];

            const cleanFilter = filter.substring(1);
            const oldest = cleanFilter;
            const newest = IncrementVersion(cleanFilter, UpdateType.Major);
            if (!newest) return [];

            const matchingVersions: PackageMetaData[] = versionsOfThis.filter((iteration) => {
                const version = iteration.Version;
                return semver.gte(version, oldest) && semver.lt(version, newest);
            });

            return matchingVersions;
        } catch {
            return [];
        }
    }
}

export async function RetrievePartitionedVersions(
    requests: GetPackagesData[],
    partitionSize: number = PAGE_SIZE
): Promise<VersionPartitons> {
    const versions: GetPackagesResponseBody = await FetchVersions(requests);
    return PartitionArray<PackageMetaData>(versions, partitionSize);
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
