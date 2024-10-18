import { FindWeightSpecByReceiver, WeightSpec } from "./WeightSpec";
import { EMPTY_WEIGHTSPEC, WeightSpecSet, DEFAULT_WEIGHTS } from "./Weightspec.const";
import { TryIndexOrDefaultTo } from "../../../DSinc_Modules/DSinc_LoopsMaps";
import { MetricName } from "./Metric.const";
import { Metric } from "./Metric";

export class RepoScoreset {
    private weightSum: number;
    private scoreSum: number;
    private timeSum: number;
    private latestNet: number;
    private rampup_score: Metric;
    private correctness_score: Metric;
    private busfactor_score: Metric;
    private responsiveness_score: Metric;
    private license_score: Metric;
    private versionDependence_score: Metric;
    private mergeRestriction_score: Metric;
    private isCompatible: boolean = true;
    private metrics: Metric[];

    constructor(weightspec?: WeightSpecSet) {
        this.weightSum = 0;
        this.scoreSum = 0;
        this.timeSum = 0;
        this.latestNet = -1;

        const weights = weightspec ? this.ProcessWeightSpecSet(weightspec) : DEFAULT_WEIGHTS;

        this.rampup_score = new Metric(weights[0]);
        this.correctness_score = new Metric(weights[1]);
        this.busfactor_score = new Metric(weights[2]);
        this.responsiveness_score = new Metric(weights[3]);
        this.license_score = new Metric(weights[4]);
        this.versionDependence_score = new Metric(weights[5]);
        this.mergeRestriction_score = new Metric(weights[6]);

        this.metrics = [
            this.rampup_score,
            this.correctness_score,
            this.busfactor_score,
            this.responsiveness_score,
            this.license_score,
            this.versionDependence_score,
            this.mergeRestriction_score,
        ];
    }

    ProcessWeightSpecSet(weightspecs: WeightSpecSet): WeightSpecSet {
        let safeSpec = new Array<WeightSpec>();

        const indices = this.RearrangeSpecSet(weightspecs);

        let rampupSpec = TryIndexOrDefaultTo<WeightSpec>(weightspecs, indices[0], EMPTY_WEIGHTSPEC);
        let correctnessSpec = TryIndexOrDefaultTo<WeightSpec>(weightspecs, indices[1], EMPTY_WEIGHTSPEC);
        let busfactorSpec = TryIndexOrDefaultTo<WeightSpec>(weightspecs, indices[2], EMPTY_WEIGHTSPEC);
        let responseSpec = TryIndexOrDefaultTo<WeightSpec>(weightspecs, indices[3], EMPTY_WEIGHTSPEC);
        let licensingSpec = TryIndexOrDefaultTo<WeightSpec>(weightspecs, indices[4], EMPTY_WEIGHTSPEC);
        let versionSpec = TryIndexOrDefaultTo<WeightSpec>(weightspecs, indices[5], EMPTY_WEIGHTSPEC);
        let mergeSpec = TryIndexOrDefaultTo<WeightSpec>(weightspecs, indices[6], EMPTY_WEIGHTSPEC);

        safeSpec[0] = rampupSpec == EMPTY_WEIGHTSPEC ? DEFAULT_WEIGHTS[0] : rampupSpec;
        safeSpec[1] = correctnessSpec == EMPTY_WEIGHTSPEC ? DEFAULT_WEIGHTS[1] : correctnessSpec;
        safeSpec[2] = busfactorSpec == EMPTY_WEIGHTSPEC ? DEFAULT_WEIGHTS[2] : busfactorSpec;
        safeSpec[3] = responseSpec == EMPTY_WEIGHTSPEC ? DEFAULT_WEIGHTS[3] : responseSpec;
        safeSpec[4] = licensingSpec == EMPTY_WEIGHTSPEC ? DEFAULT_WEIGHTS[4] : licensingSpec;
        safeSpec[5] = versionSpec == EMPTY_WEIGHTSPEC ? DEFAULT_WEIGHTS[5] : versionSpec;
        safeSpec[6] = mergeSpec == EMPTY_WEIGHTSPEC ? DEFAULT_WEIGHTS[6] : mergeSpec;

        return safeSpec;
    }

    public RearrangeSpecSet(weightSpecs: WeightSpecSet): number[] {
        let indices = [0, 0, 0, 0, 0, 0, 0];

        // Each index will be set to the indexOf the Weightspec with the matching name.
        // If such a weightspec does not exist, the returned index will be -1
        indices[0] = FindWeightSpecByReceiver(weightSpecs, MetricName.RampUpTime);
        indices[1] = FindWeightSpecByReceiver(weightSpecs, MetricName.Correctness);
        indices[2] = FindWeightSpecByReceiver(weightSpecs, MetricName.BusFactor);
        indices[3] = FindWeightSpecByReceiver(weightSpecs, MetricName.MaintainerResponsiveness);
        indices[4] = FindWeightSpecByReceiver(weightSpecs, MetricName.LienseCompatibility);
        indices[5] = FindWeightSpecByReceiver(weightSpecs, MetricName.VersionDependence);
        indices[6] = FindWeightSpecByReceiver(weightSpecs, MetricName.PRMergeRestriction);

        return indices;
    }

    private CommonAddMethod(data: Metric): Metric | undefined {
        const autoFailer = this.isCompatible ? 1 : 0;
        if (data.Name == MetricName.Unknown) {
            return undefined;
        }

        if (data.Name === MetricName.LienseCompatibility) {
            this.isCompatible = data.UnweightedScore == 1;
        }

        let ref = this.metrics[data.Name];
        this.scoreSum = this.scoreSum - ref.AdjustedScore + data.AdjustedScore;
        this.timeSum = this.timeSum - ref.Time + data.Time;
        this.latestNet = this.weightSum > 0 ? this.scoreSum / this.weightSum : -1;

        return ref;
    }

    public AddScore_Unweighted(data: Metric) {
        let ref = this.CommonAddMethod(data);
        if (ref) {
            ref.RecalculateBy_RawScore(data.UnweightedScore, data.Time);
        }
    }

    public AddScore(data: Metric) {
        let ref = this.CommonAddMethod(data);
        if (ref) {
            ref.RecalculateBy_WeightedScore(data.AdjustedScore, data.Time);
        }
    }

    public CalculateNet(): number {
        const autoFailer = this.isCompatible ? 1 : 0;
        let scores = 0;
        let times = 0;

        for (let i = 0; i < 7; i++) {
            scores += this.metrics[i].AdjustedScore;
            times += this.metrics[i].Time;
        }

        this.timeSum = times;
        this.scoreSum = scores;

        let adjusted_sum = this.scoreSum * autoFailer;
        this.latestNet = this.weightSum > 0 ? adjusted_sum / this.weightSum : -1;
        return this.latestNet;
    }

    public TimeSum(): number {
        return this.timeSum;
    }

    public ScoreSum(): number {
        return this.scoreSum;
    }

    public CurrentScore(): number {
        return this.latestNet;
    }
}
