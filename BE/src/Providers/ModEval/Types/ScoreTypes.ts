export const EMPTY_SCOREINFO = { scoreVal: -1, time: -1 };

export enum SubscoreName {
    RampUpTime = 0,
    Correctness = 1,
    BusFactor = 2,
    MaintainerResponsiveness = 3,
    LienseCompatibility = 4,
    VersionDependence = 5,
    PRMergeRestriction = 6,
    Unknown = 7,
}

export type ScoreInfo = {
    scoreVal: number;
    time: number;
};

export type RepoScoreSet = {
    rampup_score: ScoreInfo;
    correctness_score: ScoreInfo;
    busfactor_score: ScoreInfo;
    responsiveness_score: ScoreInfo;
    license_score: ScoreInfo;
    versionDependence_score: ScoreInfo;
    mergeRestriction_score: ScoreInfo;
    net: NetValue;
};

export class RepositoryScoreSet {
    rampup_score: ScoreInfo;
    correctness_score: ScoreInfo;
    busfactor_score: ScoreInfo;
    responsiveness_score: ScoreInfo;
    license_score: ScoreInfo;
    versionDependence_score: ScoreInfo;
    mergeRestriction_score: ScoreInfo;
    private weightSum: number;
    private scoreSum: number;
    private time: number;
    net: number;

    constructor() {
        this.weightSum = 0;
        this.scoreSum = 0;
        this.time = 0;
        this.net = 0;
        this.rampup_score = EMPTY_SCOREINFO;
        this.correctness_score = EMPTY_SCOREINFO;
        this.busfactor_score = EMPTY_SCOREINFO;
        this.responsiveness_score = EMPTY_SCOREINFO;
        this.license_score = EMPTY_SCOREINFO;
        this.versionDependence_score = EMPTY_SCOREINFO;
        this.mergeRestriction_score = EMPTY_SCOREINFO;
    }

    public Copy(rhs: RepositoryScoreSet) {
        this.weightSum = rhs.weightSum;
        this.scoreSum = rhs.scoreSum;
        this.time = rhs.time;
    }

    public Add(subscore: ScoreInfo, weight: number = 1) {
        this.scoreSum += subscore.scoreVal;
        this.time += subscore.time;
        this.weightSum += weight;
    }

    public TimeSum() {
        return this.time;
    }

    public ScoreSum() {
        return this.scoreSum;
    }

    public CurrentScore() {
        return this.weightSum == 0 ? -1 : this.scoreSum / this.weightSum;
    }
}

export class NetValue {
    private weightSum: number;
    private scoreSum: number;
    private time: number;

    constructor() {
        this.weightSum = 0;
        this.scoreSum = 0;
        this.time = 0;
    }

    public Copy(rhs: NetValue) {
        this.weightSum = rhs.weightSum;
        this.scoreSum = rhs.scoreSum;
        this.time = rhs.time;
    }

    public Add(subscore: ScoreInfo, weight: number = 1) {
        this.scoreSum += subscore.scoreVal;
        this.time += subscore.time;
        this.weightSum += weight;
    }

    public TimeSum() {
        return this.time;
    }

    public ScoreSum() {
        return this.scoreSum;
    }

    public CurrentScore() {
        return this.weightSum == 0 ? -1 : this.scoreSum / this.weightSum;
    }
}
