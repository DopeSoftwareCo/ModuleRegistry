import { Package } from "../../../Schemas/Package";
import { PackageMetaData } from "../../../Types/Models";
import { UpdateType, VersionRangeEndpoints } from "./types";
import * as semver from "semver";

export const versionFormat = "(\\d+)\\.(\\d+)\\.(\\d+)"; // Matches three groups of numbers.
export const versionFormatRegex = `^[~^]?${versionFormat}(-${versionFormat})?$`; // Allows optional prefix and range.
export const VersionType_RegExp = new RegExp(versionFormatRegex);
export const SimpleVersion_RegExp = new RegExp(versionFormat);

export function IsVersionString(someString: string): boolean {
    return VersionType_RegExp.test(someString);
}

export function IncrementVersion(current: string, updateType: UpdateType): string | undefined {
    // MajorStr.MinorStr.PatchStr <==> major#.minor#.patch#
    const tokens = TokenizeVersion(current);
    if (!tokens) {
        return undefined;
    }

    let newVersion: string | undefined;
    const dotZero = ".0";

    let major = parseInt(tokens.major);
    let minor = parseInt(tokens.minor);
    let patch = parseInt(tokens.patch);

    if (isNaN(major) || isNaN(minor) || isNaN(patch)) {
        return undefined;
    }

    if (updateType == UpdateType.Major) {
        ++major;
        minor = 0;
        patch = 0;
    } else if (updateType == UpdateType.Minor) {
        ++minor;
        patch = 0;
    } else {
        ++patch;
    }

    return `${major}.${minor}.${patch}`;
}

export function GetRangeEndpoints(dashFormattedRangeString: string): VersionRangeEndpoints | undefined {
    if (dashFormattedRangeString.length < 1) {
        return undefined;
    }
    const vString = dashFormattedRangeString.trim();
    const components = vString.split("-");

    if (components.length !== 2) {
        return undefined;
    }

    const earliest = components[0];
    const latest = components[1];
    return SimpleVersion_RegExp.test(earliest) && SimpleVersion_RegExp.test(latest)
        ? { oldest: earliest, newest: latest }
        : undefined;
}

export function TokenizeVersion(
    version: string
): { major: string; minor: string; patch: string } | undefined {
    const tokens = version.split(".");
    return tokens.length === 3 ? { major: tokens[0], minor: tokens[1], patch: tokens[2] } : undefined;
}

export function SortByVersion(unsorted: Package[], newestFirst: boolean = true): Package[] {
    const yes = newestFirst ? 1 : -1;
    const no = yes * -1;

    return unsorted.sort((left, right) => {
        return semver.lt(left.metadata.Version, right.metadata.Version) ? yes : no;
    });
}

export function SortByVersion_Metadata(
    unsorted: PackageMetaData[],
    newestFirst: boolean = true
): PackageMetaData[] {
    const yes = newestFirst ? 1 : -1;
    const no = yes * -1;

    return unsorted.sort((left, right) => {
        return semver.lt(left.Version, right.Version) ? yes : no;
    });
}
