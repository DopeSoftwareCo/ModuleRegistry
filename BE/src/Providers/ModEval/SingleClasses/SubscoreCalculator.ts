import * as DSincMath from "../../../DSinc_Modules/DSinc_Math";
import { TargetRepository } from "./TargetRepository";
import { functionTimer } from "../Assets/Octavo/src/function-timer";
import { ScoreInfo } from "../Types/ScoreTypes";

export type StandardScoringFunction = (repo: TargetRepository) => number;
export type AsyncScoringFunction = (repo: TargetRepository) => Promise<number>;

export class SubscoreCalculator {
    protected weight: number;
    protected default_weight: number;
    protected scoringFunction: StandardScoringFunction | AsyncScoringFunction;

    constructor(scoringFunction: AsyncScoringFunction, w?: number, default_w?: number) {
        this.default_weight = default_w ? DSincMath.ToPositive(default_w) : 1;
        this.weight = w ? DSincMath.ToPositive(w) : this.default_weight;
        this.scoringFunction = scoringFunction;
    }

    public async Score(repo: TargetRepository): Promise<number> {
        let rawScore = await this.CalculateUnweighted(repo);
        return rawScore * this.weight;
    }

    public async CalculateUnweighted(repo: TargetRepository): Promise<number> {
        return await this.scoringFunction(repo);
    }

    public async TimeAndScore(repo: TargetRepository): Promise<ScoreInfo> {
        let result = await functionTimer(() => this.Score(repo));
        const scoreInfo: ScoreInfo = {
            scoreVal: result.output,
            time: result.time,
        };

        return scoreInfo;
    }

    public GetScoringFunction(): StandardScoringFunction | AsyncScoringFunction {
        return this.scoringFunction;
    }

    public Weight(): number {
        return this.weight;
    }
    public DefaultWeight(): number {
        return this.default_weight;
    }
}
