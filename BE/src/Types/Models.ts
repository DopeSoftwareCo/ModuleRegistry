export type PackageMetaData = {
    //only typical keyboard characters, * is reserved
    Name: string;
    Version: string;
    ID: string;
};

export type PackageData = {
    //folder encoded in base64
    Content?: string;
    URL?: string;
    JSProgram?: string;
    debloat?: boolean;
};

export interface Package {
    metadata: PackageMetaData;
    data: PackageData;
}

export interface User {
    name: string;
    isAdmin: boolean;
}

export interface UserAuthenticationInfo {
    password: string;
}

export interface PackageRating {
    BusFactor: number;
    Correctness: number;
    RampUp: number;
    ResponsiveMaintainer: number;
    LicenseScore: number;
    GoodPinningPractice: number;
    PullRequest: number;
    NetScore: number;
}

export interface PackageCost {
    //if dep=true in path means standaloneCost is required
    standaloneCost: number;
    totalCost: number;
}

export type HistoryActions = "CREATE" | "UPDATE" | "DOWNLOAD" | "RATE";

export interface PackageHistoryEntry {
    User: User;
    Date: Date;
    PackageMetaData: PackageMetaData;
    Action: HistoryActions;
}

export interface AuthenticationRequestModel {
    User: User;
    Secret: UserAuthenticationInfo;
}

export interface PackageQuery {
    //example: Exact (1.2.3) Bounded range (1.2.3-2.1.0) Carat (^1.2.3) Tilde (~1.2.0)
    Version?: string;
    //only typical keyboard characters, * is reserved
    Name: string;
}
