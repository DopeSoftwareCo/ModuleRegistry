import { Package } from "../../src/Schemas/Package";
import { GetPackagesResponseBody } from "ResponseTypes";
import { APIPackageMetaData } from "../../src/Types/Models";
import {
    GetRangeEndpoints,
    IncrementVersion,
    VersionType_RegExp,
} from "../../src/Providers/PackageVersioning/utils";
import semver from "semver";
import { GetPackagesData } from "RequestTypes";
import { UpdateType } from "../../src/Providers/PackageVersioning/types";
import { createRandomPackage, MakeFakePackage } from "../../src/Services/MongoDB";

export const alphabeticalStartExpression = `^[a-zA-Z]`;
export const alphaStartRegex = new RegExp(alphabeticalStartExpression);

export abstract class AlphabeticalCataloguee<T> {
    storage: Array<T>[];
    constructor() {
        this.storage = new Array<T[]>(52);
        for (let i = 0; i < 52; i++) {
            this.storage[i] = [];
        }
    }

    WordToIndex(word: string): number {
        const proceed = alphaStartRegex.test(word);
        if (!proceed) {
            return -1;
        }

        let ascii = word.charCodeAt(0);
        ascii -= 65;

        if (ascii > 26) {
            ascii -= 6;
        }
        return ascii;
    }

    abstract Insert(item: T): boolean;
}

export class FakeMongoDB extends AlphabeticalCataloguee<Package> {
    Insert(item: Package): boolean {
        const title = item.metadata.Name;
        const index = this.WordToIndex(title);

        if (index > -1) {
            const projects = this.storage[index];
            projects.push(item);
            return true;
        }
        return false;
    }

    Remove(id: string) {}

    SelectProject(name: string): Package[] {
        const index = this.WordToIndex(name);

        if (index > -1) {
            const projects = this.storage[index];
            const allVersions = projects.filter((thisPackage) => {
                if (thisPackage.metadata.Name === name) {
                    return thisPackage;
                }
            });
            return allVersions;
        }
        return [];
    }

    Select(): Array<Package[]> {
        return this.storage;
    }

    PrintAll() {
        this.storage.forEach((item) => {
            item.forEach((version) => {
                console.log({
                    Metadata: {
                        Name: version.metadata.Name,
                        Version: version.metadata.Version,
                        ID: version.id,
                    },
                });
            });
        });
    }
}

export const FakeMongo = new FakeMongoDB();

export namespace fakeMongoFunctions {
    async function Upload() {}

    async function Download() {}

    async function Update() {}

    async function DisplayAll() {}

    async function FetchDir() {}

    export namespace SearchBy {
        export function MapPackagesToAPIMetadata(project: Package[]) {
            return project.map<APIPackageMetaData>((iteration) => {
                return {
                    Name: iteration.metadata.Name,
                    Version: iteration.metadata.Version,
                    ID: iteration.id,
                };
            });
        }

        export async function ByExact(title: string, filter: string): Promise<GetPackagesResponseBody> {
            let result: APIPackageMetaData[] = [];
            const project = FakeMongo.SelectProject(title);
            const allVersions = MapPackagesToAPIMetadata(project);
            if (allVersions.length < 1) {
                return [];
            }

            const matches: APIPackageMetaData[] = allVersions.filter((iteration) => {
                if (iteration.Version === filter) {
                    return iteration;
                }
            });
            return matches;
        }

        export async function BySimpleRange(title: string, filter: string): Promise<GetPackagesResponseBody> {
            const rangeEndpoints = GetRangeEndpoints(filter);
            if (!rangeEndpoints) return [];
            try {
                const project = FakeMongo.SelectProject(title);
                const allVersions = MapPackagesToAPIMetadata(project);
                if (allVersions.length < 1) {
                    return [];
                }

                const matches: APIPackageMetaData[] = allVersions.filter((iteration) => {
                    const version = iteration.Version;
                    return (
                        semver.gte(version, rangeEndpoints.oldest) &&
                        semver.lte(version, rangeEndpoints.newest)
                    );
                });

                return matches;
            } catch {
                return [];
            }
        }

        export async function ByTilde(title: string, filter: string): Promise<GetPackagesResponseBody> {
            try {
                const project = FakeMongo.SelectProject(title);
                const allVersions = MapPackagesToAPIMetadata(project);
                if (allVersions.length < 1) {
                    return [];
                }

                const oldest = filter;
                const newest = IncrementVersion(filter, UpdateType.Minor);
                if (!newest) return [];

                const matches = allVersions.filter((iteration) => {
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
                const project = FakeMongo.SelectProject(title);
                const allVersions = MapPackagesToAPIMetadata(project);
                if (allVersions.length < 1) {
                    return [];
                }

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
                result = await fakeMongoFunctions.SearchBy.ByTilde(title, filter);
            } else if (symbol === "^") {
                result = await fakeMongoFunctions.SearchBy.ByCaret(title, filter);
            } else if (filter.includes("-")) {
                result = await fakeMongoFunctions.SearchBy.BySimpleRange(title, filter);
            } else {
                result = await fakeMongoFunctions.SearchBy.ByExact(title, filter);
            }
        }

        return result;
    }
}

export async function FillFakeMongo() {
    const names = ["A1", "A2", "B1", "B2", "C1", "C2"];
    let name;
    let version;
    for (let i = 0; i < 3; i++) {
        for (let j = 7; j < 10; j++) {
            name = names[i];
            for (let k = 3; k < 6; k++) {
                version = `5.${j}.${k}`;
                const item: Package = MakeFakePackage(version, name);
                FakeMongo.Insert(item);
            }
        }
    }
}
