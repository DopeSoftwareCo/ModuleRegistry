import { MetricName } from "./Metric.const";
import { WeightSpec } from "./WeightSpec";
import { ToPositive } from "../../../DSinc_Modules/DSinc_Math";

const PRECISIONDEFAULT_SCORE = 2;
const PRECISIONDEFAULT_RAW = 2;
const PRECISIONDEFAULT_TIME = 6;

export class Metric {
    private weight: number;
    private name: MetricName;
    private score: number = 0;
    private time: number = 0;
    private rawScore: number = 0;
    private isHigh: boolean = false;

    constructor(weightspec: WeightSpec, weightedScore: number = 0, time: number = 0) {
        this.weight = weightspec.Weight();
        this.name = weightspec.Receiver();

        this.ReplaceScore(weightedScore, PRECISIONDEFAULT_SCORE);
        this.DetermineRaw(true, PRECISIONDEFAULT_RAW);
        this.ReplaceTime(time, PRECISIONDEFAULT_TIME);
        this.isHigh = this.rawScore >= 0.5;
    }

    RecalculateBy_RawScore(score: number, time: number) {
        this.rawScore = score >= 0 ? score : ToPositive(score);
        this.ReplaceTime(time, PRECISIONDEFAULT_TIME);
        this.ReplaceScore(score, 2);
        this.isHigh = this.rawScore >= 0.5;
    }
    get UnweightedScore(): number {
        return this.rawScore;
    }

    RecalculateBy_WeightedScore(score: number, time: number) {
        this.ReplaceTime(time, PRECISIONDEFAULT_TIME);
        this.ReplaceScore(score, 2);
        this.DetermineRaw(true, 2);
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
        this.ReplaceTime(newTime, PRECISIONDEFAULT_TIME);
    }
    get IsHigh(): boolean {
        return this.isHigh;
    }

    private DetermineRaw(round: boolean = false, digits: number = PRECISIONDEFAULT_RAW): void {
        let raw = this.weight > 0 ? this.score / this.weight : 0;

        if (round) {
            raw = parseFloat(raw.toPrecision(digits));
        }
        this.rawScore = raw;
    }

    private ReplaceScore(score: number, digits: number = 2): void {
        let weightedScore = score >= 0 ? score : ToPositive(score);
        this.score = parseFloat(weightedScore.toPrecision(digits));
    }

    private ReplaceTime(time: number, digits: number = PRECISIONDEFAULT_TIME): void {
        this.time = parseFloat(time.toPrecision(digits));
    }
}
