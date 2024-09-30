/* The topmost class in the design */

import { Evaluator, TargetRepository } from "./Wrapper/Evaluator";
import { Weightspec } from "./Wrapper/Weightspec";

function ModEval() {
    const spec = new Weightspec(0.1, 0.2, 0.3, 0.4);
    const evaluator = new Evaluator(spec);

    const repoA: TargetRepository = {
        identifiers: {
            owner: "exampleOwner",
            repoName: "exampleRepo",
            repoUrl: "https://github.com/exampleOwner/exampleRepo",
            fileUrl: "https://github.com/exampleOwner/exampleRepo/blob/main/exampleFile.js",
            description: "This is an example repository for demonstration purposes.",
        },
        queryResult: {
            url: "someurl",
            name: "name",
            description: "uh",
        },
        scores: {
            rampup_score: 80,
            correctness_score: 90,
            busfactor_score: 75,
            responsiveness_score: 85,
            license_score: 95,
            netscore: 85,
        },
        ndjson: {
            scores: {
                rampup_score: 80,
                correctness_score: 90,
                busfactor_score: 75,
                responsiveness_score: 85,
                license_score: 95,
                netscore: 85,
            },
            latencies: {
                rampup_latency: 50,
                correctness_latency: 40,
                busfactor_latency: 30,
                response_latency: 60,
                license_latency: 25,
                combined_latency: 55,
            },
            url: "https://example.com/ndjson",
        },
    };

    const repoB: TargetRepository = {
        identifiers: {
            owner: "sampleOwner",
            repoName: "sampleRepo",
            repoUrl: "https://github.com/sampleOwner/sampleRepo",
            fileUrl: "https://github.com/sampleOwner/sampleRepo/blob/main/sampleFile.js",
            description: "This is a sample repository for testing purposes.",
        },
        queryResult: {
            url: "https://api.example.com/repo",
            name: "Sample Repository",
            description: "A repository used for testing various functionalities.",
        },
        scores: {
            rampup_score: 70,
            correctness_score: 85,
            busfactor_score: 60,
            responsiveness_score: 90,
            license_score: 100,
            netscore: 80,
        },
        ndjson: {
            scores: {
                rampup_score: 70,
                correctness_score: 85,
                busfactor_score: 60,
                responsiveness_score: 90,
                license_score: 100,
                netscore: 80,
            },
            latencies: {
                rampup_latency: 55,
                correctness_latency: 35,
                busfactor_latency: 45,
                response_latency: 50,
                license_latency: 20,
                combined_latency: 48,
            },
            url: "https://sample.com/ndjson",
        },
    };

    let testInput = [repoA, repoB];
    evaluator.Evaluate(testInput);
}
