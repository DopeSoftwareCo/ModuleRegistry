//import { Evaluator } from "../src/Providers/Evaluation/Evaluator"
//import { Weightspec } from "../src/Providers/Evaluation/Weightspec";
import { describe, expect, test } from "@jest/globals";
import { VersionDependence_Scorer } from "../src/Providers/ModEval/Functions/DSincScorers";
import { Repository } from "../src/Providers/ModEval/RepoComponents/Repository";
import { GQLResultData, DependencyGraphManifestNode } from "../src/Providers/ModEval/GQL_Queries/Reponse/GQLResponse";

describe("Version Dependence", () => {
    test("Size 0", async () => {
        const repo1: Repository = {
            QueryResult: {
                dependencyGraphManifests: {nodes: Array(0)}
            } as GQLResultData
        } as Partial<Repository> as Repository;
        // let number_of_dependencies = repo.QueryResult?.dependencyGraphManifests?.nodes.length; 
        const test1 = await VersionDependence_Scorer(repo1);
        expect(test1).toBe(1);
    });
    test("Size 2", async () => {
        const repo1: Repository = {
            QueryResult: {
                dependencyGraphManifests: {nodes: Array(2)}
            } as GQLResultData
        } as Partial<Repository> as Repository;
        // let number_of_dependencies = repo.QueryResult?.dependencyGraphManifests?.nodes.length; 
        const test1 = await VersionDependence_Scorer(repo1);
        expect(test1).toBe(0.5);
    });
    test("Size 6", async () => {
        const repo1: Repository = {
            QueryResult: {
                dependencyGraphManifests: {nodes: Array(6)}
            } as GQLResultData
        } as Partial<Repository> as Repository;
        // let number_of_dependencies = repo.QueryResult?.dependencyGraphManifests?.nodes.length; 
        const test1 = await VersionDependence_Scorer(repo1);
        expect(test1).toBe(0.25);
    });
    test("Size 14", async () => {
        const repo1: Repository = {
            QueryResult: {
                dependencyGraphManifests: {nodes: Array(14)}
            } as GQLResultData
        } as Partial<Repository> as Repository;
        // let number_of_dependencies = repo.QueryResult?.dependencyGraphManifests?.nodes.length; 
        const test1 = await VersionDependence_Scorer(repo1);
        expect(test1).toBe(0.125);
    });
});