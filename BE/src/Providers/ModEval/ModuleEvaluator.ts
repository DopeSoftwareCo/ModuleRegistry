import * as OctScore from "./ScoringFunctions/OctavoScorers";
import { Repository } from "./RepoComponents/Repository";
import { Metric } from "./Scores/Metric";
import { MetricName } from "./Scores/Metric.const";
import { SubscoreCalculator } from "./Scores/ScoreCalculator";
import { WeightSpec, FindWeightSpecByReceiver } from "./Scores/WeightSpec";
import { EMPTY_WEIGHTSPEC, WeightSpecSet } from "./Scores/Weightspec.const";
import { AsyncLooper, TryIndexOrDefaultTo } from "../../DSinc_Modules/DSinc_LoopsMaps";
import * as DSincScore from "./ScoringFunctions/DSincScorers";
import {
    RAMPUP_WEIGHT_DEFAULT,
    CORRECTNESS_WEIGHT_DEFAULT,
    BUSFACTOR_WEIGHT_DEFAULT,
    RESPONSIVENESS_WEIGHT_DEFAULT,
    LICENSE_WEIGHT,
    VERSIONDEP_WEIGHT_DEFAULT,
    MERGERESTRICT_WEIGHT_DEFAULT,
} from "./Scores/Weightspec.const";

// How crucial are each of these factors on a 1-7 scale?
/*
                   METRIC NAME      AN "IDEAL" SCORE IS
                ----------------------------------------
                 Ramp Up Time:      HIGH
                  Correctness:      HIGH
                   Bus Factor:      HIGH
    Maintainer Responsiveness:      HIGH
        License Compatibility:      == 1
           Version Dependency:       LOW        (Calculate this as the inverse of dependence, i.e. 1/dep)
         PR Merge Restriction:      HIGH

*/

export class ModuleEvaluator {
    asyncLooper: AsyncLooper;
    rampUp: SubscoreCalculator;
    correctness: SubscoreCalculator;
    busFactor: SubscoreCalculator;
    responsiveness: SubscoreCalculator;
    licensing: SubscoreCalculator;
    versionDependence: SubscoreCalculator;
    mergeRestriction: SubscoreCalculator;
    maxPoints: number;

    constructor(weightspecs: WeightSpecSet) {
        this.asyncLooper = new AsyncLooper();
        const weights = this.ProcessWeightSpecSet(weightspecs);

        this.rampUp = new SubscoreCalculator(
            OctScore.RampUp_WrappedScorer,
            MetricName.RampUpTime,
            weights[0]
        );
        this.correctness = new SubscoreCalculator(
            OctScore.Correctness_WrappedScorer,
            MetricName.Correctness,
            weights[1]
        );
        this.busFactor = new SubscoreCalculator(
            OctScore.BusFactor_WrappedScorer,
            MetricName.BusFactor,
            weights[2]
        );
        this.responsiveness = new SubscoreCalculator(
            OctScore.Responsiveness_WrappedScorer,
            MetricName.MaintainerResponsiveness,
            weights[3]
        );
        this.licensing = new SubscoreCalculator(
            OctScore.LicenseCompatibility_WrapperScorer,
            MetricName.LienseCompatibility,
            weights[4]
        );
        this.versionDependence = new SubscoreCalculator(
            DSincScore.VersionDependence_Scorer,
            MetricName.VersionDependence,
            weights[5]
        );
        this.mergeRestriction = new SubscoreCalculator(
            DSincScore.MergeRestriction_Scorer,
            MetricName.PRMergeRestriction,
            weights[6]
        );

        // The maximum score that a repo evaluated under these weights could produce
        this.maxPoints =
            this.rampUp.Weight +
            this.correctness.Weight +
            this.busFactor.Weight +
            this.responsiveness.Weight +
            this.licensing.Weight +
            this.versionDependence.Weight +
            this.mergeRestriction.Weight;
    }

    public ProcessWeightSpecSet(weightspecs: WeightSpecSet): number[] {
        let safeSpecs = [0, 0, 0, 0, 0, 0, 0];

        const indices = this.RearrangeSpecSet(weightspecs);

        let rampupSpec = TryIndexOrDefaultTo<WeightSpec>(weightspecs, indices[0], EMPTY_WEIGHTSPEC);
        let correctnessSpec = TryIndexOrDefaultTo<WeightSpec>(weightspecs, indices[1], EMPTY_WEIGHTSPEC);
        let busfactorSpec = TryIndexOrDefaultTo<WeightSpec>(weightspecs, indices[2], EMPTY_WEIGHTSPEC);
        let responsivenessSpec = TryIndexOrDefaultTo<WeightSpec>(weightspecs, indices[3], EMPTY_WEIGHTSPEC);
        let licensingSpec = TryIndexOrDefaultTo<WeightSpec>(weightspecs, indices[4], EMPTY_WEIGHTSPEC);
        let versionDepSpec = TryIndexOrDefaultTo<WeightSpec>(weightspecs, indices[5], EMPTY_WEIGHTSPEC);
        let mergeRestrictionSpec = TryIndexOrDefaultTo<WeightSpec>(weightspecs, indices[6], EMPTY_WEIGHTSPEC);

        safeSpecs[0] = rampupSpec == EMPTY_WEIGHTSPEC ? RAMPUP_WEIGHT_DEFAULT : rampupSpec.Weight();
        safeSpecs[1] =
            correctnessSpec == EMPTY_WEIGHTSPEC ? CORRECTNESS_WEIGHT_DEFAULT : correctnessSpec.Weight();
        safeSpecs[2] = busfactorSpec == EMPTY_WEIGHTSPEC ? BUSFACTOR_WEIGHT_DEFAULT : busfactorSpec.Weight();
        safeSpecs[3] =
            responsivenessSpec == EMPTY_WEIGHTSPEC
                ? RESPONSIVENESS_WEIGHT_DEFAULT
                : responsivenessSpec.Weight();
        safeSpecs[4] = licensingSpec == EMPTY_WEIGHTSPEC ? LICENSE_WEIGHT : licensingSpec.Weight();
        safeSpecs[5] =
            versionDepSpec == EMPTY_WEIGHTSPEC ? VERSIONDEP_WEIGHT_DEFAULT : versionDepSpec.Weight();
        safeSpecs[6] =
            mergeRestrictionSpec == EMPTY_WEIGHTSPEC
                ? MERGERESTRICT_WEIGHT_DEFAULT
                : mergeRestrictionSpec.Weight();

        return safeSpecs;
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

    public async MultiEval(repos: Array<Repository>): Promise<void> {
        await this.asyncLooper.ForEach<Repository, number>(repos, this.Eval.bind(this));
    }

    public async Eval(repo: Repository): Promise<number> {
        const scores = await this.CalculateTimesAndScores(repo);

        repo.Scores.AddScore(scores[0]);
        repo.Scores.AddScore(scores[1]);
        repo.Scores.AddScore(scores[2]);
        repo.Scores.AddScore(scores[3]);
        repo.Scores.AddScore(scores[4]);
        repo.Scores.AddScore(scores[5]);
        repo.Scores.AddScore(scores[6]);

        return repo.Scores.CurrentScore();
    }

    public async CalculateTimesAndScores(repo: Repository): Promise<Metric[]> {
        let scores = Array<Metric>(7);
        scores[0] = await this.rampUp.TimeAndScore(repo);
        scores[1] = await this.correctness.TimeAndScore(repo);
        scores[2] = await this.busFactor.TimeAndScore(repo);
        scores[3] = await this.responsiveness.TimeAndScore(repo);
        scores[4] = await this.licensing.TimeAndScore(repo);
        scores[5] = await this.versionDependence.TimeAndScore(repo);
        scores[6] = await this.mergeRestriction.TimeAndScore(repo);

        return scores;
    }
}
