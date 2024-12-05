import PackageModel, { Package } from "../../../Schemas/Package";
import { GetPackagesResponseBody } from "ResponseTypes";
import { PAGE_SIZE, SearchResult, UpdateType } from "./types";
import {
    GetRangeEndpoints,
    IncrementVersion,
    SortByVersion,
    SortByVersion_Metadata,
    VersionType_RegExp,
} from "./utils";
import { GetPackagesData } from "RequestTypes";
import semver from "semver";
import { PackageMetaData } from "../../../Types/Models";
import { PartitionArray } from "../../../Utils/DSinc/Array";
import { FetchAllPackages } from "../BasicFunctionality/FetchAll";

export async function ProcessPackageSearch(
    requests: GetPackagesData[],
    partitionSize: number = PAGE_SIZE,
    sortByVersion: boolean = true,
    newestFirst: boolean = true
): Promise<SearchResult> {
    if (requests.length == 1 && requests[0].Name === "*") {
        const fetchResult = await FetchAllPackages(10000, partitionSize);
        return {
            dataPartitions: fetchResult.chunks,
            fetchAllResult: fetchResult,
        };
    }

    const packages = await CombineSearchRequestResults(requests, sortByVersion, newestFirst);
    console.log(packages);
    const partitioned = PartitionArray(packages, partitionSize);

    return {
        dataPartitions: partitioned,
    };
}

export async function CombineSearchRequestResults(
    requests: GetPackagesData[],
    sortByVersion: boolean = true,
    newestFirst: boolean = true
): Promise<GetPackagesResponseBody> {
    let versions: GetPackagesResponseBody = [];

    const response = requests.map((req) => ExecuteSearchRequest(req));
    const arrays = await Promise.all(response);

    console.log("CombineSearchRequestResults");
    console.log(arrays);

    arrays.forEach((arr) => {
        versions.push(...arr);
    });

    if (sortByVersion) {
        SortByVersion_Metadata(versions, newestFirst);
    }

    return versions;
}

export async function ExecuteSearchRequest(request: GetPackagesData): Promise<GetPackagesResponseBody> {
    const title = request.Name;
    const hasVersion = request.Version != undefined;

    if (!hasVersion) {
        return await SearchPackages.ByName(title);
    }

    const filter = request.Version.trim();
    return await SearchPackages.LimitVersions.Any(title, filter);
}

export namespace SearchPackages {
    export async function ByName(
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

    export namespace LimitVersions {
        export async function Any(title: string, filter: string): Promise<GetPackagesResponseBody> {
            let result: GetPackagesResponseBody = [];
            const proceed = VersionType_RegExp.test(filter);

            console.log("Proceed?");
            console.log(proceed);

            if (proceed) {
                const symbol = filter[0];

                if (symbol === "~") {
                    result = await ByTilde(title, filter);
                } else if (symbol === "^") {
                    result = await ByCaret(title, filter);
                } else if (filter.includes("-")) {
                    console.log("Ok ... Sending to bounded range handler");
                    result = await BySimpleRange(title, filter);
                } else {
                    result = await ByExact(title, filter);
                }
            }
            return result;
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
                const versionsOfThis = await ByName(title);
                const matchingVersions: PackageMetaData[] = versionsOfThis.filter((iteration) => {
                    const version = iteration.Version;
                    return (
                        semver.gte(version, rangeEndpoints.oldest) &&
                        semver.lte(version, rangeEndpoints.newest)
                    );
                });

                console.log("Matching versions:");
                console.log(matchingVersions);
                return matchingVersions;
            } catch {
                console.log("An error occurred in BySimpleRange");
                return [];
            }
        }

        export async function ByTilde(title: string, filter: string): Promise<GetPackagesResponseBody> {
            try {
                const versionsOfThis = await ByName(title);
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
                const versionsOfThis = await ByName(title);
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
}
