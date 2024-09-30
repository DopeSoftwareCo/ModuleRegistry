import * as Scoring from "../Wrapper/Weightspec"
import * as DSincMath from "../../../DSinc_Modules/DSinc_Math"
import { BaseRepoQueryResponse } from "../../RawAssets/Primero/MVP/src/Types/ResponseTypes";
const RAMPUP_WEIGHT_DEFAULT = 0.3;
const CORRECTNESS_WEIGHT_DEFAULT = 0.3;
const BUSFACTOR_WEIGHT_DEFAULT = 0.2;
const RESPONSIVENESS_WEIGHT_DEFAULT = 2;

type LatencyScoreSet =
{
    rampup_latency: number;
    correctness_latency: number;
    busfactor_latency: number;
    response_latency: number;
    license_latency: number;
    combined_latency: number;
}


type NDJSON_RowInfo =
{
    scores: RepoScoreSet,
    latencies: LatencyScoreSet,
    url: string
}

type RepoScoreSet =
{
    rampup_score: number;
    correctness_score: number;
    busfactor_score: number;
    responsiveness_score: number;
    license_score: number;
    netscore: number;
}


type RepositoryIdentification =
{
    owner: string;
    repoName: string;
    repoUrl?: string;
    fileUrl: string;
    description: string;
}


export type TargetRepository =
{
    identifiers: RepositoryIdentification;
    queryResult: BaseRepoQueryResponse;
    scores: RepoScoreSet; // (A) swap out for NDJSONRow or (B) 
    ndjson: NDJSON_RowInfo;
}






    
export type Repository<T> = {
    owner: string;
    repoName: string;
    description?: string;
    repoUrl?: string;
    fileUrl: string;
    queryResult: {
        name: string;
        url: string;
        description: string;
        licenseInfo?: {
            name: string;
        };
        openIssues?: {
            totalCount: number;
        };
        closedIssues?: {
            totalCount: number;
        };
        stargazerCount?: number;
        ref?: {
            target?: {
                history: {
                    edges?: [
                        {
                            node: {
                                author: {
                                    name: string;
                                };
                            };
                        }
                    ];
                };
            };
        };
        readmeFile?: {
            text: string;
        };
        testsCheckMain?: {
            entries: {
                name: string;
                type: string;
            }[];
        };
        testsCheckMaster?: {
            entries: {
                name: string;
                type: string;
            }[];
        };
    } & T;
    NDJSONRow: Partial<{
        URL: string;
        NetScore: number;
        NetScore_Latency: number;
        RampUp: number;
        RampUp_Latency: number;
        Correctness: number;
        Correctness_Latency: number;
        BusFactor: number;
        BusFactor_Latency: number;
        ResponsiveMaintainer: number;
        ResponsiveMaintainer_Latency: number;
        License: number;
        License_Latency: number;
    }>;
};


// The repo item given to the evaluators might be an object or maybe it'll be a class... idk
// Will need to consult TM


export class Evaluator
{
    rampUp: RampUp_SubscoreCalculator;
    correctness: Correctness_SubscoreCalculator;
    busFactor: BusFactor_SubscoreCalculator;
    responsiveness: Responsive_SubscoreCalculator;
    licensing: License_SubscoreCalculator;

    
    constructor(weightSpec: Scoring.Weightspec)
    {
        this.rampUp = new RampUp_SubscoreCalculator(weightSpec.rampup_weight);
        this.correctness = new Correctness_SubscoreCalculator(weightSpec.busfactor_weight);
        this.busFactor = new BusFactor_SubscoreCalculator(weightSpec.busfactor_weight);
        this.responsiveness = new Responsive_SubscoreCalculator(weightSpec.response_weight);
        this.licensing = new License_SubscoreCalculator();
    }


    Evaluate(repos: Array<TargetRepository>): void
    {
        repos.forEach(unscoredRepo => {
            this.DoSingleEvaluation(unscoredRepo);
        });
    }


    DoSingleEvaluation(repo: TargetRepository): number
    {
        let netscore = 0;
        netscore += this.rampUp.CalculateSubscore(repo);
        netscore += this.correctness.CalculateSubscore(repo);
        netscore += this.busFactor.CalculateSubscore(repo);
        netscore += this.licensing.CalculateSubscore(repo);

        return netscore;
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

    abstract CalculateSubscore(repo: TargetRepository): number;
}



class RampUp_SubscoreCalculator extends SubscoreCalculator
{
    constructor (weightReq?: number)
    {
        super(weightReq, RAMPUP_WEIGHT_DEFAULT);
    }

    CalculateSubscore(repo: TargetRepository): number
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

    CalculateSubscore(repo: TargetRepository): number
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

    CalculateSubscore(repo: TargetRepository): number
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

    CalculateSubscore(repo: TargetRepository): number
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

    CalculateSubscore(repo: TargetRepository): number
    {
        // Replace =1 with result from calling inherited function or og
        let unweighted = 1;
    
        return unweighted * this.weight;
    }
}