import * as OctScore from "../Functions/OctavoScorers";
import { TargetRepository } from "./TargetRepository";
import { RepoScoreSet, NetValue, SubscoreName, EMPTY_SCOREINFO, ScoreInfo } from "../Types/ScoreTypes";
import { SubscoreCalculator } from "./SubscoreCalculator";
import { EMPTY_WEIGHTSPEC, WeightSpec, WeightSpecSet, FindWeightSpecByReceiver } from "./WeightSpec";
import { AsyncForEach, TryIndexOrDefaultTo } from "../../../DSinc_Modules/DSinc_LoopsMaps";
import * as DSincScore from "../Functions/DSincScorers";

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

export const RAMPUP_WEIGHT_DEFAULT = 0.3;
export const CORRECTNESS_WEIGHT_DEFAULT = 0.3;
export const BUSFACTOR_WEIGHT_DEFAULT = 0.5;
export const RESPONSIVENESS_WEIGHT_DEFAULT = 2;
export const LICENSE_WEIGHT = 1;
export const VERSIONDEP_WEIGHT_DEFAULT = 0.4;
export const MERGERESTRICT_WEIGHT_DEFAULT = 0.9;

export class Evaluator {
    rampUp: SubscoreCalculator;
    correctness: SubscoreCalculator;
    busFactor: SubscoreCalculator;
    responsiveness: SubscoreCalculator;
    licensing: SubscoreCalculator;
    versionDependence: SubscoreCalculator;
    mergeRestriction: SubscoreCalculator;

    maxPoints: number;

    constructor(weightspecs: WeightSpecSet) {
        const weights = this.ProcessWeightSpecSet(weightspecs);

        this.rampUp = new SubscoreCalculator(OctScore.RampUp_WrappedScorer, weights[0]);
        this.correctness = new SubscoreCalculator(OctScore.Correctness_WrappedScorer, weights[1]);
        this.busFactor = new SubscoreCalculator(OctScore.BusFactor_WrappedScorer, weights[2]);
        this.responsiveness = new SubscoreCalculator(OctScore.Responsiveness_WrappedScorer, weights[3]);
        this.licensing = new SubscoreCalculator(OctScore.LicenseCompatibility_WrapperScorer, weights[4]);
        this.versionDependence = new SubscoreCalculator(DSincScore.VersionDependence_Scorer, weights[5]);
        this.mergeRestriction = new SubscoreCalculator(DSincScore.MergeRestriction_Scorer, weights[6]);

        // The maximum score that a repo evaluated under these weights could produce
        this.maxPoints =
            this.rampUp.Weight() +
            this.correctness.Weight() +
            this.busFactor.Weight() +
            this.responsiveness.Weight() +
            LICENSE_WEIGHT +
            this.versionDependence.Weight() +
            this.mergeRestriction.Weight();
    }

    ProcessWeightSpecSet(weightspecs: WeightSpecSet): number[] {
        let safe_WeightSpecs = [0, 0, 0, 0, 0, 0, 0];

        const indices = this.RearrangeSpecSet(weightspecs);

        let rampupSpec = TryIndexOrDefaultTo<WeightSpec>(weightspecs, indices[0], EMPTY_WEIGHTSPEC);
        let correctnessSpec = TryIndexOrDefaultTo<WeightSpec>(weightspecs, indices[1], EMPTY_WEIGHTSPEC);
        let busfactorSpec = TryIndexOrDefaultTo<WeightSpec>(weightspecs, indices[2], EMPTY_WEIGHTSPEC);
        let responsivenessSpec = TryIndexOrDefaultTo<WeightSpec>(weightspecs, indices[3], EMPTY_WEIGHTSPEC);
        let licensingSpec = TryIndexOrDefaultTo<WeightSpec>(weightspecs, indices[4], EMPTY_WEIGHTSPEC);
        let versionDependanceSpec = TryIndexOrDefaultTo<WeightSpec>(
            weightspecs,
            indices[5],
            EMPTY_WEIGHTSPEC
        );
        let mergeRestrictionSpec = TryIndexOrDefaultTo<WeightSpec>(weightspecs, indices[6], EMPTY_WEIGHTSPEC);

        safe_WeightSpecs[0] = rampupSpec == EMPTY_WEIGHTSPEC ? RAMPUP_WEIGHT_DEFAULT : rampupSpec.Weight();
        safe_WeightSpecs[1] =
            correctnessSpec == EMPTY_WEIGHTSPEC ? CORRECTNESS_WEIGHT_DEFAULT : correctnessSpec.Weight();
        safe_WeightSpecs[2] =
            busfactorSpec == EMPTY_WEIGHTSPEC ? BUSFACTOR_WEIGHT_DEFAULT : busfactorSpec.Weight();
        safe_WeightSpecs[3] =
            responsivenessSpec == EMPTY_WEIGHTSPEC
                ? RESPONSIVENESS_WEIGHT_DEFAULT
                : responsivenessSpec.Weight();
        safe_WeightSpecs[4] = licensingSpec == EMPTY_WEIGHTSPEC ? LICENSE_WEIGHT : licensingSpec.Weight();
        safe_WeightSpecs[5] =
            versionDependanceSpec == EMPTY_WEIGHTSPEC
                ? VERSIONDEP_WEIGHT_DEFAULT
                : versionDependanceSpec.Weight();
        safe_WeightSpecs[6] =
            mergeRestrictionSpec == EMPTY_WEIGHTSPEC
                ? MERGERESTRICT_WEIGHT_DEFAULT
                : mergeRestrictionSpec.Weight();

        return safe_WeightSpecs;
    }

    public RearrangeSpecSet(weightSpecs: WeightSpecSet): number[] {
        let indices = [0, 0, 0, 0, 0, 0, 0];

        // Each index will be set to the indexOf the Weightspec with the matching name.
        // If such a weightspec does not exist, the returned index will be -1
        indices[0] = FindWeightSpecByReceiver(weightSpecs, SubscoreName.RampUpTime);
        indices[1] = FindWeightSpecByReceiver(weightSpecs, SubscoreName.Correctness);
        indices[2] = FindWeightSpecByReceiver(weightSpecs, SubscoreName.BusFactor);
        indices[3] = FindWeightSpecByReceiver(weightSpecs, SubscoreName.MaintainerResponsiveness);
        indices[4] = FindWeightSpecByReceiver(weightSpecs, SubscoreName.LienseCompatibility);
        indices[5] = FindWeightSpecByReceiver(weightSpecs, SubscoreName.VersionDependence);
        indices[6] = FindWeightSpecByReceiver(weightSpecs, SubscoreName.PRMergeRestriction);

        return indices;
    }

    public async MultiEval(repos: Array<TargetRepository>): Promise<void> {
        await this.Eval(repos[1]);
        if (!this.rampUp) {
            console.log("fuck.");
        }
        //await AsyncForEach<TargetRepository,void>(repos, this.Eval);
    }

    public async Eval(repo: TargetRepository): Promise<NetValue> {
        let netval = new NetValue();
        const scores = await this.CalculateTimesAndScores(repo);
        repo.Scores.rampup_score = scores[0];
        repo.Scores.busfactor_score = scores[1];
        repo.Scores.correctness_score = scores[2];
        repo.Scores.responsiveness_score = scores[3];
        repo.Scores.license_score = scores[4];
        repo.Scores.versionDependence_score = scores[5];
        repo.Scores.mergeRestriction_score = scores[6];

        repo.Scores.net.Add(repo.Scores.rampup_score, this.rampUp.Weight());
        repo.Scores.net.Add(repo.Scores.correctness_score, this.correctness.Weight());
        repo.Scores.net.Add(repo.Scores.busfactor_score, this.busFactor.Weight());
        repo.Scores.net.Add(repo.Scores.responsiveness_score, this.responsiveness.Weight());
        repo.Scores.net.Add(repo.Scores.license_score, LICENSE_WEIGHT);
        repo.Scores.net.Add(repo.Scores.versionDependence_score, this.responsiveness.Weight());
        repo.Scores.net.Add(repo.Scores.mergeRestriction_score, this.responsiveness.Weight());
        return repo.Scores.net;
    }

    private async CalculateTimesAndScores(repo: TargetRepository): Promise<ScoreInfo[]> {
        let scores = Array<ScoreInfo>(7);
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
