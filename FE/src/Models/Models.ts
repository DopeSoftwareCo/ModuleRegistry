export type PackageMetaDataFromAPI = {
    //only typical keyboard characters, * is reserved
    Name: string;
    Version: string;
    ID: string;
};

export type PackageDataFromAPI = {
    //folder encoded in base64
    Content?: string;
    URL?: string;
    JSProgram?: string;
};

export interface PackageFromAPI {
    metadata: PackageMetaDataFromAPI;
    data: PackageDataFromAPI;
}

export interface User {
    name: string;
    isAdmin: boolean;
}

export interface UserAuthenticationInfo {
    password: string;
}

export interface PackageRatingFromAPI {
    BusFactor: number;
    Correctness: number;
    RampUp: number;
    ResponsiveMaintainer: number;
    LicenseScore: number;
    GoodPinningPractice: number;
    PullRequest: number;
    NetScore: number;
}

export type HistoryActions = 'CREATE' | 'UPDATE' | 'DOWNLOAD' | 'RATE';

export interface PackageHistoryEntry {
    User: User;
    Date: Date;
    PackageMetaData: PackageMetaDataFromAPI;
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

export interface DBPackageFromAPI {
    _id: string;
    metaData: {
        Name: string;
        Version: string;
    };
    data: {
        Content: string;
        JSProgram: string;
    };
    title: string;
    repoUrl: string;
    uploader: string;
    visibility: 'secret' | 'internal' | 'public';
    isExternal: boolean;
    safety: 'unsafe' | 'unknown' | 'vetted';
    secrecyEnabled: boolean;
    license: string;
    rampup_score: number;
    score_correctness: number;
    score_busFactor: number;
    score_license: number;
    score_versionDependence: number;
    score_mergeRestriction: number;
    score_pullrequest: number;
    score_responsiveMaintainer: number;
    score_goodPinningPractice: number;
    score_sizeCostTotal: number;
    score_sizeCostStandalone: number;
    netscore: number;
    updatedAt: string;
}

export interface DBPackagesFromAPI {
    packages: DBPackageFromAPI[];
}

export interface Package {
    _id: string;
    name: string;
    version: string;
    ratings: PackageRatingFromAPI;
    standaloneCost: number;
    totalCost: number;
    repoUrl: string;
    uploader: string;
    visibility: 'secret' | 'internal' | 'public';
    isExternal: boolean;
    safety: 'unsafe' | 'unknown' | 'vetted';
    secrecyEnabled: boolean;
    license: string;
    updatedAt: string;
}

export type Packages = Package[];
