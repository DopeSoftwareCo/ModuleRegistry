import { NDJSONRow } from "../Providers/ModEval/Assets/Primero/MVP/src/Types/DataTypes";
import { RepoScoreSet, RepositoryScoreSet, ScoreInfo } from "../Providers/ModEval/Types/ScoreTypes";
import { TargetRepository } from "../Providers/ModEval/SingleClasses/TargetRepository";

export enum PackageVisibility {
    SecretScope = 0,
    InternalScope = 1,
    PublicScope = 2,
}

export function MakePositiveInteger(n: number): number {
    // Force positive
    let posInt = n > 0 ? n : n * -1;

    // Force integer
    return Math.floor(posInt);
}

export class PackageVersion {
    private versionString: string = "";
    private major: number;
    private minor: number;
    private patch: number;

    constructor(majorNum: number, minorNum?: number, patchNum?: number) {
        this.major = MakePositiveInteger(majorNum);
        this.minor = minorNum ? MakePositiveInteger(minorNum) : 0;
        this.patch = patchNum ? MakePositiveInteger(patchNum) : 0;

        this.versionString = this.BuildVersionString();
    }

    private BuildVersionString(): string {
        let vstring = "";
        vstring += this.major.toString();
        vstring += ".";
        vstring += this.minor.toString();
        vstring += ".";
        vstring += this.patch.toString();
        return vstring;
    }

    public Update(newMajor?: number, newMinor?: number, newPatch?: number): void {
        if (newMajor && newMajor) {
            if (newMajor != this.major) {
                this.major = MakePositiveInteger(newMajor);
            }
        }

        if (newMinor && newMinor) {
            if (newMinor != this.minor) {
                this.minor = MakePositiveInteger(newMinor);
            }
        }

        if (newPatch && newPatch) {
            if (newPatch != this.major) {
                this.patch = MakePositiveInteger(newPatch);
            }
        }

        this.BuildVersionString();
    }

    get VersionString() {
        return this.versionString;
    }
    get Major() {
        return this.major;
    }
    get Minor() {
        return this.minor;
    }
    get Patch() {
        return this.patch;
    }
}

export class User {
    UID: string;
    username: string;
    permission: USD_Permission;

    constructor(username: string, permissions: USD_Permission) {
        this.UID = "xxxx-xx"; // Will be generated
        this.username = username;
        this.permission = permissions;
    }
}

class USD_Permission {
    uploadPermission: number;
    searchPermission: number;
    deletePermission: number;

    constructor(u: number, s: number, d: number) {
        this.uploadPermission = MakePositiveInteger(u);
        this.searchPermission = MakePositiveInteger(s);
        this.deletePermission = MakePositiveInteger(d);
    }

    get U(): number {
        return this.uploadPermission;
    }
    get S(): number {
        return this.searchPermission;
    }
    get D(): number {
        return this.deletePermission;
    }
}

export type UploadMetadata = {
    uploader: User;
    dateOfUpload: Date;
    visibility: PackageVisibility;
    secrecyEnabled: boolean;
    packageID: string;
};

type VersionNumbers = {
    major: number;
    minor: number;
    patch: number;
};

export class RegistryPackage {
    packageID: string;
    title: string;
    repo: TargetRepository;
    repoURL: string;
    version: PackageVersion;
    licenseName: string;
    scores: RepoScoreSet; // This is under refactor ... will be replaced by RepositoryScoreset
    uploadMetadata: UploadMetadata;
    content: string;
    // will probably add an ndjson row member

    constructor(
        packageName: string,
        repository: TargetRepository,
        version: VersionNumbers,
        metadata: UploadMetadata,
        content: string
    ) {
        this.packageID = metadata.packageID;
        this.title = packageName;
        this.repo = repository;
        this.repoURL = repository.Identifiers.url_info.gitURL;
        this.version = new PackageVersion(version.major, version.minor, version.patch);
        this.licenseName = repository.License;
        this.scores = repository.Scores;
        this.uploadMetadata = metadata;
        this.content = content; // the long data string containing the material
    }

    // Functionality to be added as methods as needed

    get PackageID(): string {
        return this.packageID;
    }
    get Title(): string {
        return this.title;
    }
    get RepositoryURL(): string {
        return this.repoURL;
    }
    get UploaderID(): string {
        return this.uploadMetadata.uploader.UID;
    }
    get DateOfUpload(): Date {
        return this.uploadMetadata.dateOfUpload;
    }
    get SecrecyEnabled(): boolean {
        return this.uploadMetadata.secrecyEnabled;
    }
    get Visbility(): PackageVisibility {
        return this.uploadMetadata.visibility;
    }
    get License(): string {
        return this.licenseName;
    }
    get Scores(): RepoScoreSet {
        return this.scores;
    }
    get Content(): string {
        return this.content;
    }
}
