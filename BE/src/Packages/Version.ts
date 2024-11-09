import { UserType } from "../Types/Models";

export interface Version {
    major: number;
    minor: number;
    patch: number;
}

export function StringToVersion(stringFormat: string): Version | undefined {
    // 0.0.0 -- minimum version string size is 5
    if (stringFormat.length < 5) {
        return undefined;
    }
    const componentStrings = stringFormat.split(".");

    // [0].[0].[0] -- valid version string has 3 pieces
    if (componentStrings.length != 3) {
        return undefined;
    }

    try {
        let major = Number.parseInt(componentStrings[0]);
        let minor = Number.parseInt(componentStrings[1]);
        let patch = Number.parseInt(componentStrings[2]);

        const numericVersion: Version = { major: major, minor: minor, patch: patch };
        return numericVersion;
    } catch {
        return undefined;
    }
}

export function VersionToString(version: Version): string {
    const major_int = Math.trunc(version.major);
    const minor_int = Math.trunc(version.minor);
    const patch_int = Math.trunc(version.patch);

    return `${major_int}.${minor_int}.${patch_int}`;
}
