/* The topmost class in the design */
import {Evaluator, repoXYZ} from './Evaluation/Evaluator'
import { Weightspec } from './Evaluation/Weightspec'



function ModEval()
{
    const spec = new Weightspec(0.10,0.20,0.30,0.40);
    const evaluator = new Evaluator(spec);
    
    let repoA: repoXYZ =
    {
        link: "www.Link.A",
        scoreSet:
            {
                rampup_score: 0,
                correctness_score: 0,
                busfactor_score: 0,
                responsiveness_score: 0,
                license_score: 0,
                netscore: 0
            }
    };

    let repoB: repoXYZ =
    {
        link: "www.Link.B",
        scoreSet:
            {
                rampup_score: 0,
                correctness_score: 0,
                busfactor_score: 0,
                responsiveness_score: 0,
                license_score: 0,
                netscore: 0
            }
    };

    let testInput = [repoA, repoB];
    evaluator.Evaluate(testInput);
}


