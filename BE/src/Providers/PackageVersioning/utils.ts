import { UpdateType, VersionRangeEndpoints } from "./types";

export function IsVersionString(someString: string): boolean {
    const components = someString.split(".");
    if (components.length !== 3) {
        return false;
    }

    try {
        const max = parseInt(components[0]);
        const min = parseInt(components[1]);
        const patch = parseInt(components[2]);
        return true;
    } catch {
        return false;
    }
}

export function IncrementVersion(current: string, updateType: UpdateType): string | undefined {
    // MajorStr.MinorStr.PatchStr <==> major#.minor#.patch#
    const strComponents = current.split(".");
    if (strComponents.length != 3) {
        return undefined;
    }

    let newVersion: string | undefined;
    const dotZero = ".0";

    if (updateType == UpdateType.Major) {
        let major = parseInt(strComponents[0]);
        if (!major) return undefined;

        ++major;
        newVersion = major + dotZero + dotZero;
    } else if (updateType == UpdateType.Minor) {
        let minor = parseInt(strComponents[1]);
        if (!minor) return undefined;

        const major = strComponents[0] + ".";
        ++minor;
        newVersion = major + minor + dotZero;
    } else {
        let patch = parseInt(strComponents[2]);
        if (!patch) return undefined;

        const major = strComponents[0] + ".";
        const minor = strComponents[0] + ".";
        patch++;
        newVersion = major + minor + "." + patch;
    }
    return newVersion;
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
    return IsVersionString(earliest) && IsVersionString(latest)
        ? { earliest: earliest, latest: latest }
        : undefined;
}
