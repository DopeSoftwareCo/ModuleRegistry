import * as OctScore from '../Functions/OctavoScorers';
import { TargetRepository } from "./TargetRepository";
import { RepoScoreSet, NetValue, SubscoreName, EMPTY_SCOREINFO } from "../Types/ScoreTypes";
import { SubscoreCalculator } from "./SubscoreCalculator";
import { EMPTY_WEIGHTSPEC, WeightSpec, WeightSpecSet, FindWeightSpecByReceiver } from "./WeightSpec";
import { AsyncForEach, TryIndexOrDefaultTo} from "../../../DSinc_Modules/DSinc_LoopsMaps";
import * as DSincScore from '../Functions/DSincScorers';



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
export const VERSIONDEP_WEIGHT_DEFAULT = 0.4 
export const MERGERESTRICT_WEIGHT_DEFAULT = 0.9;



export class Evaluator
{
    rampUp: SubscoreCalculator;
    correctness: SubscoreCalculator;
    busFactor: SubscoreCalculator;
    responsiveness: SubscoreCalculator;
    licensing: SubscoreCalculator;
    versionDependence: SubscoreCalculator;
    mergeRestriction: SubscoreCalculator;

    maxPoints: number;
    
    constructor(weightspecs: WeightSpecSet)
    {
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
        (
            this.rampUp.Weight() + this.correctness.Weight() + this.busFactor.Weight() + this.responsiveness.Weight()
            + LICENSE_WEIGHT + this.versionDependence.Weight() + this.mergeRestriction.Weight()
        );
    }


    ProcessWeightSpecSet(weightspecs: WeightSpecSet) : number[]
    {
        let safe_WeightSpecs = [0, 0, 0, 0, 0, 0, 0]

        const indices = this.RearrangeSpecSet(weightspecs);

        let rampupSpec = TryIndexOrDefaultTo<WeightSpec>(weightspecs, indices[0], EMPTY_WEIGHTSPEC);
        let correctnessSpec = TryIndexOrDefaultTo<WeightSpec>(weightspecs, indices[1], EMPTY_WEIGHTSPEC);
        let busfactorSpec = TryIndexOrDefaultTo<WeightSpec>(weightspecs, indices[2], EMPTY_WEIGHTSPEC);
        let responsivenessSpec = TryIndexOrDefaultTo<WeightSpec>(weightspecs, indices[3], EMPTY_WEIGHTSPEC);
        let licensingSpec = TryIndexOrDefaultTo<WeightSpec>(weightspecs, indices[4], EMPTY_WEIGHTSPEC);
        let versionDependanceSpec = TryIndexOrDefaultTo<WeightSpec>(weightspecs, indices[5], EMPTY_WEIGHTSPEC);
        let mergeRestrictionSpec = TryIndexOrDefaultTo<WeightSpec>(weightspecs, indices[6], EMPTY_WEIGHTSPEC);

        safe_WeightSpecs[0] = (rampupSpec == EMPTY_WEIGHTSPEC) ?  RAMPUP_WEIGHT_DEFAULT : rampupSpec.Weight();
        safe_WeightSpecs[1] = (correctnessSpec == EMPTY_WEIGHTSPEC) ?  CORRECTNESS_WEIGHT_DEFAULT :  correctnessSpec.Weight();
        safe_WeightSpecs[2] = ( busfactorSpec == EMPTY_WEIGHTSPEC) ?  BUSFACTOR_WEIGHT_DEFAULT :  busfactorSpec.Weight();
        safe_WeightSpecs[3] = ( responsivenessSpec == EMPTY_WEIGHTSPEC) ?  RESPONSIVENESS_WEIGHT_DEFAULT :  responsivenessSpec.Weight();
        safe_WeightSpecs[4] = ( licensingSpec == EMPTY_WEIGHTSPEC) ?  LICENSE_WEIGHT :  licensingSpec.Weight();
        safe_WeightSpecs[5] = ( versionDependanceSpec == EMPTY_WEIGHTSPEC) ?  VERSIONDEP_WEIGHT_DEFAULT :  versionDependanceSpec.Weight();
        safe_WeightSpecs[6] = ( mergeRestrictionSpec == EMPTY_WEIGHTSPEC) ?  MERGERESTRICT_WEIGHT_DEFAULT :  mergeRestrictionSpec.Weight();

        return safe_WeightSpecs;
    }

    public RearrangeSpecSet(weightSpecs: WeightSpecSet) : number[]
    {
        let indices = [0, 0, 0, 0, 0, 0, 0];
        
        // Each index will be set to the indexOf the Weightspec with the matching name.
        // If such a weightspec does not exist, the returned index will be -1
        indices[0] =  FindWeightSpecByReceiver(weightSpecs, SubscoreName.RampUpTime);
        indices[1] =  FindWeightSpecByReceiver(weightSpecs, SubscoreName.Correctness);
        indices[2] = FindWeightSpecByReceiver(weightSpecs, SubscoreName.BusFactor);
        indices[3] =  FindWeightSpecByReceiver(weightSpecs, SubscoreName.MaintainerResponsiveness);
        indices[4] =  FindWeightSpecByReceiver(weightSpecs, SubscoreName.LienseCompatibility);
        indices[5] =  FindWeightSpecByReceiver(weightSpecs, SubscoreName.VersionDependence);
        indices[6] = FindWeightSpecByReceiver(weightSpecs, SubscoreName.PRMergeRestriction);
        
        return indices;
    }


    public async MultiEval(repos: &Array<TargetRepository>): Promise<void>
    {
        await AsyncForEach<TargetRepository,void>(repos, this.Eval);   
    }


    public async Eval (repo: TargetRepository) : Promise<void>
    {     
        let netval = new NetValue();
        let scores: RepoScoreSet =
        {
            rampup_score: EMPTY_SCOREINFO,
            correctness_score: EMPTY_SCOREINFO,
            busfactor_score: EMPTY_SCOREINFO,
            responsiveness_score: EMPTY_SCOREINFO,
            license_score: EMPTY_SCOREINFO,
            versionDependence_score: EMPTY_SCOREINFO,
            mergeRestriction_score: EMPTY_SCOREINFO,
            net: new NetValue(),
        }

        scores.rampup_score = await this.rampUp.TimeAndScore(repo)
        netval.Add(scores.rampup_score, this.rampUp.Weight());
        
        scores.correctness_score = await this.correctness.TimeAndScore(repo)
        netval.Add(scores.correctness_score, this.correctness.Weight());

        scores.busfactor_score= await this.busFactor.TimeAndScore(repo)
        netval.Add(scores.busfactor_score, this.busFactor.Weight());

        scores.responsiveness_score= await this.responsiveness.TimeAndScore(repo)
        netval.Add(scores.responsiveness_score, this.responsiveness.Weight());

        scores.license_score = await this.licensing.TimeAndScore(repo)
        netval.Add(scores.license_score, LICENSE_WEIGHT);

        scores.versionDependence_score = await this.responsiveness.TimeAndScore(repo)
        netval.Add(scores.versionDependence_score, this.responsiveness.Weight());

        scores.mergeRestriction_score = await this.responsiveness.TimeAndScore(repo)
        netval.Add(scores.mergeRestriction_score, this.responsiveness.Weight());
    

        scores.net.Copy(netval);
        repo.Scores = scores;
    }
}