import PackageModel from "../../Schemas/Package";
import { CompletePackage, EmptyProject, Project } from "./types";
import { GetRangeEndpoints, IsVersionString } from "./utils";
import semver from "semver";

export namespace SearchVersion {
    export async function ByExact(
        filter: string,
        project: string,
        skipProject: boolean = false
    ): Promise<CompletePackage[] | undefined> {
        if (skipProject) {
            const result = await PackageModel.find<CompletePackage>({ "metadata.Version": filter });
            return result;
        }

        const matches = await PackageModel.find<CompletePackage>({
            //projectID: project.projectID,
            "metadata.version": filter,
        });
        return matches;
    }

    export async function BySimpleRange(
        filter: string,
        project: string,
        skipProject: boolean = false
    ): Promise<CompletePackage[] | undefined> {
        const rangeEndpoints = GetRangeEndpoints(filter);
        if (!rangeEndpoints) {
            return undefined;
        }

        const allPackages = await PackageModel.find<CompletePackage>({
            "metadata.Version": { $exists: true }, // Ensure version field exists
        });

        const matches = allPackages.filter((pkg) => {
            const version = pkg.metadata.Version;
            if (IsVersionString(version)) {
                // Check if the version is a valid semantic version
                return (
                    semver.gte(version, rangeEndpoints.earliest) && semver.lte(version, rangeEndpoints.latest)
                );
            }
        });

        console.log(
            matches.map((match) => {
                return { name: match.Title, version: match.metadata.Version };
            })
        );

        return matches;
    }

    export async function ByRegex(project: Project, filter: string): Promise<CompletePackage[] | undefined> {
        return undefined;
    }

    export async function ByTilde(project: Project, filter: string): Promise<CompletePackage[] | undefined> {
        return undefined;
    }

    export async function ByCarat(project: Project, filter: string): Promise<CompletePackage[] | undefined> {
        return undefined;
    }
}
