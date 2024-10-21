import * as DSincMath from "../../../DSinc_Modules/DSinc_Math";
import { Repository } from "../RepoComponents/Repository";
import { functionTimer } from "../Assets/Octavo/src/function-timer";
import { Metric } from "./Metric";
import { MetricName } from "./Metric.const";
import { StandardScoringFunction, AsyncScoringFunction } from "./ScoreCalculator.interface";
import { WeightSpec } from "./WeightSpec";

export class SubscoreCalculator {
    protected weight: number;
    protected default_weight: number;
    protected associatedMetric: MetricName;
    protected scoringFunction: StandardScoringFunction | AsyncScoringFunction;

    constructor(
        scoringFunction: AsyncScoringFunction,
        correspondingMetric: MetricName = MetricName.Unknown,
        w?: number,
        default_w?: number
    ) {
        this.default_weight = default_w ? DSincMath.ToPositive(default_w) : 1;
        this.weight = w ? DSincMath.ToPositive(w) : this.default_weight;
        this.scoringFunction = scoringFunction;
        this.associatedMetric = correspondingMetric;
    }

    public async Score(repo: Repository): Promise<number> {
        let rawScore = await this.CalculateUnweighted(repo);
        return rawScore * this.weight;
    }

    public async CalculateUnweighted(repo: Repository): Promise<number> {
        return await this.scoringFunction(repo);
    }

    public async TimeAndScore(repo: Repository): Promise<Metric> {
        let result = await functionTimer(() => this.Score(repo));

        const spec = new WeightSpec(this.associatedMetric, this.weight);
        const scoredMetric: Metric = new Metric(spec);
        scoredMetric.RecalculateBy_WeightedScore(result.output, result.time);
        return scoredMetric;
    }

    get ScoringFunction(): StandardScoringFunction | AsyncScoringFunction {
        return this.scoringFunction;
    }

    get Weight(): number {
        return this.weight;
    }
    get DefaultWeight(): number {
        return this.default_weight;
    }
}
