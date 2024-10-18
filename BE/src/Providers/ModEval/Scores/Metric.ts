import { MetricName } from "./Metric.const";
import { WeightSpec } from "./WeightSpec";
import { ToPositive } from "../../../DSinc_Modules/DSinc_Math";

export class Metric {
    private weight: number;
    private name: MetricName;
    private score: number;
    private time: number;
    private rawScore: number;
    private isHigh: boolean;

    constructor(weightspec: WeightSpec, weightedScore: number = 0, time: number = 0) {
        this.weight = weightspec.Weight();
        this.name = weightspec.Receiver();
        this.score = weightedScore;
        this.time = time;
        this.rawScore = 0;
        this.isHigh = false;
    }

    RecalculateBy_RawScore(score: number, time: number) {
        this.rawScore = score >= 0 ? score : ToPositive(score);
        this.score = this.rawScore * this.weight;
        this.isHigh = this.rawScore >= 0.5;
    }
    get UnweightedScore(): number {
        return this.rawScore;
    }

    RecalculateBy_WeightedScore(score: number, time: number) {
        this.score = score >= 0 ? score : ToPositive(score);
        this.rawScore = this.weight > 0 ? this.score / this.weight : 0;
        this.isHigh = this.rawScore >= 0.5;
    }
    get AdjustedScore(): number {
        return this.score;
    }

    get Weight(): number {
        return this.weight;
    }
    get Name(): MetricName {
        return this.name;
    }
    get Time(): number {
        return this.time;
    }
    set Time(newTime: number) {
        this.time = newTime;
    }
    get IsHigh(): boolean {
        return this.isHigh;
    }
}
