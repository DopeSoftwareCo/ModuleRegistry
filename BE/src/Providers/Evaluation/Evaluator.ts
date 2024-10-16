import * as Scoring from './Weightspec';
import * as DSincMath from '../DSinc_Modules/DSinc_Math'
const RAMPUP_WEIGHT_DEFAULT = 0.3;
const CORRECTNESS_WEIGHT_DEFAULT = 0.3;
const BUSFACTOR_WEIGHT_DEFAULT = 0.2;
const RESPONSIVENESS_WEIGHT_DEFAULT = 2;


type RepoScoreSet =
{
    rampup_score: number;
    correctness_score: number;
    busfactor_score: number;
    responsiveness_score: number;
    license_score: number;
    netscore: number;
}

// The repo item given to the evaluators might be an object or maybe it'll be a class... idk
// Will need to consult TM
export type repoXYZ =
{
    link: string;
    scoreSet: RepoScoreSet;
}

/**
 * This class is primarially a wrapper around the inherited code. 
 * Runs the calculation for all scores of every repo in the list of dependencies
 * 
 * Also calculates the version dependence
 */

export class Evaluator
{
    rampUp: RampUp_SubscoreCalculator;
    correctness: Correctness_SubscoreCalculator;
    busFactor: BusFactor_SubscoreCalculator;
    responsiveness: Responsive_SubscoreCalculator;
    licensing: License_SubscoreCalculator;

    version_dependence: number;

    
    constructor(weightSpec: Scoring.Weightspec)
    {
        this.rampUp = new RampUp_SubscoreCalculator(weightSpec.rampup_weight);
        this.correctness = new Correctness_SubscoreCalculator(weightSpec.busfactor_weight);
        this.busFactor = new BusFactor_SubscoreCalculator(weightSpec.busfactor_weight);
        this.responsiveness = new Responsive_SubscoreCalculator(weightSpec.response_weight);
        this.licensing = new License_SubscoreCalculator();
        this.version_dependence = 0;
    }


    Evaluate(repos: Array<repoXYZ>): void
    {
        repos.forEach(unscoredRepo => {
            this.DoSingleEvaluation(unscoredRepo);
        });
        this.version_dependence = this.EvaluateVersionDependence(repos.length);
    }


    DoSingleEvaluation(repo: repoXYZ): number
    {
        let netscore = 0;
        netscore += this.rampUp.CalculateSubscore(repo);
        netscore += this.correctness.CalculateSubscore(repo);
        netscore += this.busFactor.CalculateSubscore(repo);
        netscore += this.licensing.CalculateSubscore(repo);

        return netscore;
    }
    /**
     * Scores the version dependence between 1 to 0, 1 being the highest, and 0 being the lowest. 
     * Should never be 0
     * 
     * @param number_of_dependencies 
     * @returns Score based on the function 1 / (1 + (number_of_dependencies/2))
     */
    EvaluateVersionDependence(number_of_dependencies: number) : number
    {
        if (number_of_dependencies < 0) 
        {
            throw new Error("Number of dependencies cannot be negative."); // Can be changed to return 0; 
        }
        
        return 1 / (1 + (number_of_dependencies/2));
    }
}


abstract class SubscoreCalculator
{
    weight: number;
    default_weight: number;

    constructor(w?: number, default_w?: number)
    {
        this.default_weight = (default_w) ? DSincMath.ToPositive(default_w) : 0.25;
        this.weight = (w) ? DSincMath.ToPositive(w) : this.default_weight;
    }

    SetWeight(w?: number)
    {
        this.weight = (w) ? w : this.default_weight;
    }

    abstract CalculateSubscore(repo: repoXYZ): number;
}



class RampUp_SubscoreCalculator extends SubscoreCalculator
{
    constructor (weightReq?: number)
    {
        super(weightReq, RAMPUP_WEIGHT_DEFAULT);
    }

    CalculateSubscore(repo: repoXYZ): number
    {
        // Replace =1 with result from calling inherited function or og
        let unweighted = 1;
        
        return unweighted * this.weight;
    }
}


class Correctness_SubscoreCalculator extends SubscoreCalculator
{
    constructor (weightReq?: number)
    {
        super(weightReq, CORRECTNESS_WEIGHT_DEFAULT);
    }

    CalculateSubscore(repo: repoXYZ): number
    {
        // Replace =1 with result from calling inherited function or og
        let unweighted = 1;
    
        return unweighted * this.weight;
    }
}


class BusFactor_SubscoreCalculator extends SubscoreCalculator
{
    default_weight: number = BUSFACTOR_WEIGHT_DEFAULT;

    constructor (weightReq?: number) 
    {
        super(weightReq, BUSFACTOR_WEIGHT_DEFAULT);
    }

    CalculateSubscore(repo: repoXYZ): number
    {
        // Replace =1 with result from calling inherited function or og
        let unweighted = 1;
    
        return unweighted * this.weight;
    }
}


class Responsive_SubscoreCalculator extends SubscoreCalculator
{
    constructor(weightReq?: number)
    {
       super(weightReq, RESPONSIVENESS_WEIGHT_DEFAULT);
    }

    CalculateSubscore(repo: repoXYZ): number
    {
        // Replace =1 with result from calling inherited function or og
        let unweighted = 1;
    
        return unweighted * this.weight;
    }
}


class License_SubscoreCalculator extends SubscoreCalculator
{
    constructor(weightReq?: number)
    {
        super(weightReq, 1);
    }

    CalculateSubscore(repo: repoXYZ): number
    {
        // Replace =1 with result from calling inherited function or og
        let unweighted = 1;
    
        return unweighted * this.weight;
    }
}