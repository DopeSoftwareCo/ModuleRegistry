import { FindWeightSpecByReceiver, WeightSpec } from "./WeightSpec";
import { EMPTY_WEIGHTSPEC, WeightSpecSet, DEFAULT_WEIGHTS } from "./Weightspec.const";
import { TryIndexOrDefaultTo } from "../../../DSinc_Modules/DSinc_LoopsMaps";
import { MetricName } from "./Metric.const";
import { Metric } from "./Metric";

const ROUNDVALS = true;
const PRECISIONDEFAULT_NET = 2;

export abstract class I_RepoScoreset {
    protected abstract CommonAddMethod(data: Metric): Metric | undefined;
    abstract AddScore_Unweighted(data: Metric): void;
    abstract AddScore(data: Metric): void;
    abstract RecalculateNet(): number;
    abstract TimeSum(): number;
    abstract ScoreSum(): number;
    abstract CurrentScore(): number;
}

export class RepoScoreset extends I_RepoScoreset {
    private net: number = 0;
    private scoreSum: number = 0;
    private weightSum: number = 0;
    private timeSum: number = 0;
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
        super();

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

        this.weightSum =
            rampupSpec.Weight() +
            correctnessSpec.Weight() +
            busfactorSpec.Weight() +
            responseSpec.Weight() +
            licensingSpec.Weight() +
            versionSpec.Weight() +
            mergeSpec.Weight();
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

    protected CommonAddMethod(data: Metric): Metric | undefined {
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
        this.UpdateNet();

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

    private UpdateNet(round: boolean = ROUNDVALS): void {
        if (!this.isCompatible) {
            this.net = 0;
            return;
        }

        let newNet = this.weightSum > 0 ? this.scoreSum / this.weightSum : -1;

        if (round) {
            newNet = parseFloat(newNet.toPrecision(PRECISIONDEFAULT_NET));
        }
        this.net = newNet;
    }

    public RecalculateNet(): number {
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
        this.UpdateNet();
        return this.net;
    }

    public TimeSum(): number {
        return this.timeSum;
    }

    public ScoreSum(): number {
        return this.scoreSum;
    }

    public CurrentScore(): number {
        return this.net;
    }

    public GetMetricScore(metric: MetricName) {
        return metric == MetricName.Unknown ? 0 : this.metrics[metric].AdjustedScore;
    }

    public GetMetricTime(metric: MetricName) {
        return metric == MetricName.Unknown ? 0 : this.metrics[metric].Time;
    }
}
