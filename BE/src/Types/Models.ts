export type APIPackageMetaData = {
    //only typical keyboard characters, * is reserved
    Name: string;
    Version: string;
    ID: string;
};

export type APIPackageData = {
    //folder encoded in base64
    Content?: string;
    URL?: string;
    JSProgram?: string;
    debloat?: boolean;
};

export interface APIPackage {
    metadata: APIPackageMetaData;
    data: APIPackageData;
}

export interface APIUser {
    name: string;
    isAdmin: boolean;
}

export interface APIUserAuthenticationInfo {
    password: string;
}

export interface APIPackageRating {
    BusFactor: number;
    BusFactorLatency: number;
    Correctness: number;
    CorrectnessLatency: number;
    RampUp: number;
    RampUpLatency: number;
    ResponsiveMaintainer: number;
    ResponsiveMaintainerLatency: number;
    LicenseScore: number;
    LicenseScoreLatency: number;
    GoodPinningPractice: number;
    GoodPinningPracticeLatency: number;
    PullRequest: number;
    PullRequestLatency: number;
    NetScore: number;
    NetScoreLatency: number;
}

export interface APIPackageCost {
    //if dep=true in path means standaloneCost is required
    standaloneCost?: number;
    totalCost: number;
}

export type APIHistoryActions = "CREATE" | "UPDATE" | "DOWNLOAD" | "RATE";

export interface APIPackageHistoryEntry {
    User: APIUser;
    Date: Date;
    PackageMetaData: APIPackageMetaData;
    Action: APIHistoryActions;
}

export interface APIAuthenticationRequestModel {
    User: APIUser;
    Secret: APIUserAuthenticationInfo;
}

export interface APIPackageQuery {
    //example: Exact (1.2.3) Bounded range (1.2.3-2.1.0) Carat (^1.2.3) Tilde (~1.2.0)
    Version?: string;
    //only typical keyboard characters, * is reserved
    Name: string;
}
