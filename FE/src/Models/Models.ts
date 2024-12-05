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

export interface PackageFromAPIDownload {
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

export interface RegexPackageFromAPI {
    Version: string;
    Name: string;
}

export type RegexPackagesFromAPI = RegexPackageFromAPI[];

export interface DBPackageFromAPI {
    _id: string;
    Title: string;
    repoUrl: string;
    metadata: {
        Name: string;
        Version: string;
        License: {
            name: string;
            spxId: string;
            url: string;
        };
        Uploader: string;
        IsExternal: boolean;
        Safety: 'unsafe' | 'unkown' | 'vetted';
        IsSecret: boolean;
        Visibility: 'secret' | 'internal' | 'public';
        Availability: number;
        PrivelegedGroup: number;
    };
    data: {
        Content: string;
        JSProgram: string;
    };
    RampupTime: {
        rampup_score: number;
        rampup_score_latency: number;
    };
    Correctness: {
        score_correctness: number;
        score_correctness_latency: number;
    };
    BusFactor: {
        score_busFactor: number;
        score_busFactor_latency: number;
    };
    Responsiveness: {
        score_responsiveMaintainer: number;
        score_responsiveMaintainer_latency: number;
    };
    LicenseCompatibility: {
        score_license: number;
        score_license_latency: number;
    };
    VersionDependence: {
        score_versionDependence: number;
        score_versionDependence_latency: number;
    };
    MergeRestriction: {
        score_mergeRestriction: number;
        score_mergeRestriction_latency: number;
    };
    IndividualSizeCost: {
        score_sizeCostStandalone: number;
        score_sizeCostStandalone_latency: number;
    };
    TotalSizeCost: {
        score_sizeCostTotal: number;
        score_sizeCostTotal_latency: number;
    };
    GoodPinningPractice: {
        score_goodPinningPractice: number;
        score_goodPinningPracticeLatency: number;
    };
    PullRequest: {
        score_pullRequest: number;
        score_pullRequestLatency: number;
    };
    FinalRating: {
        netscore: number;
        netscore_latency: number;
    };
    updatedAt: Date;
}

export interface DBPackagesFromAPI {
    packages: DBPackageFromAPI[];
}

export type SpecificFields = { [key: string]: string | number };

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
    specificFields: SpecificFields;
}

export type Packages = Package[];

export interface PackageCostFromAPI {
    //if dep=true in path means standaloneCost is required
    [key: string]: {
        standaloneCost?: number;
        totalCost: number;
    };
}
