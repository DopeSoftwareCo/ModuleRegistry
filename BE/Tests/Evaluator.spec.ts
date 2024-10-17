import { Evaluator } from "../src/Providers/Evaluation/Evaluator"
import { Weightspec } from "../src/Providers/Evaluation/Weightspec";
import { describe, expect, test } from "@jest/globals";

describe("Evaluator Tests", () => {
    const spec = new Weightspec(0.10,0.20,0.30,0.40);
    const evaluator = new Evaluator(spec);
    test("Version Dependence Score", () => {
        expect(evaluator.EvaluateVersionDependence(0)).toBe(1);
        expect(evaluator.EvaluateVersionDependence(2)).toBe(0.5);
        expect(evaluator.EvaluateVersionDependence(6)).toBe(0.25);
        expect(evaluator.EvaluateVersionDependence(14)).toBe(0.125);
    });
});