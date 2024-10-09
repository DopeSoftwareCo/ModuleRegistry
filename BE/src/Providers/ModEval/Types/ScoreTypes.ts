
export const EMPTY_SCOREINFO = {scoreVal: -1, time: -1};


export enum SubscoreName
{
    RampUpTime = 0,
    Correctness = 1,
    BusFactor = 2,
    MaintainerResponsiveness = 3,
    LienseCompatibility = 4,
    VersionDependence = 5,
    PRMergeRestriction = 6,
    Unknown = 7
} 


export type ScoreInfo =
{
    scoreVal: number;
    time: number;
}


export type RepoScoreSet =
{
    rampup_score: ScoreInfo;
    correctness_score: ScoreInfo;
    busfactor_score: ScoreInfo;
    responsiveness_score: ScoreInfo;
    license_score: ScoreInfo;
    versionDependence_score: ScoreInfo;
    mergeRestriction_score: ScoreInfo;
    net: NetValue;
}


export class NetValue
{
    private weightSum: number;
    private sum: number;
    private time: number;

    constructor()
    {
        this.weightSum = 0;
        this.sum = 0;
        this.time = 0;
    }

    public Copy(rhs: NetValue)
    {
        this.weightSum = rhs.weightSum;
        this.sum = rhs.sum;
        this.time = rhs.time;
    }

    public Add(subscore: ScoreInfo, weight: number = 1) 
    {
        this.sum += subscore.scoreVal;
        this.time += subscore.time;
        this.weightSum += weight;
    }

    public TimeSum()
    {
        return this.time;
    }

    public ScoreSum()
    {
        return this.sum;
    }

    public CurrentScore()
    {
        return (this.weightSum == 0) ? -1 : (this.sum / this.weightSum);
    }
}

