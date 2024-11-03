//import { Evaluator } from "../src/Providers/Evaluation/Evaluator"
//import { Weightspec } from "../src/Providers/Evaluation/Weightspec";
import { describe, expect, test } from "@jest/globals";
import { VersionDependence_Scorer } from "../src/Providers/ModEval/Functions/DSincScorers";
import { Repository } from "../src/Providers/ModEval/RepoComponents/Repository";
import { GQLResultData } from "../src/Providers/ModEval/GQL_Queries/Reponse/GQLResponse";

describe("Version Dependence", () => {
    test("Size 0", async () => {
        const repo: Repository = {
            QueryResult: {
                dependencyGraphManifests: {nodes: Array(0)}
            } as GQLResultData
        } as Partial<Repository> as Repository;
        // let number_of_dependencies = repo.QueryResult?.dependencyGraphManifests?.nodes.length; 
        const test = await VersionDependence_Scorer(repo);
        expect(test).toBe(1);
    });
    test("Size 2", async () => {
        const repo: Repository = {
            QueryResult: {
                dependencyGraphManifests: {nodes: Array(2)}
            } as GQLResultData
        } as Partial<Repository> as Repository;
        // let number_of_dependencies = repo.QueryResult?.dependencyGraphManifests?.nodes.length; 
        const test = await VersionDependence_Scorer(repo);
        expect(test).toBe(0.5);
    });
    test("Size 6", async () => {
        const repo: Repository = {
            QueryResult: {
                dependencyGraphManifests: {nodes: Array(6)}
            } as GQLResultData
        } as Partial<Repository> as Repository;
        // let number_of_dependencies = repo.QueryResult?.dependencyGraphManifests?.nodes.length; 
        const test = await VersionDependence_Scorer(repo);
        expect(test).toBe(0.25);
    });
    test("Size 14", async () => {
        const repo: Repository = {
            QueryResult: {
                dependencyGraphManifests: {nodes: Array(14)}
            } as GQLResultData
        } as Partial<Repository> as Repository;
        // let number_of_dependencies = repo.QueryResult?.dependencyGraphManifests?.nodes.length; 
        const test = await VersionDependence_Scorer(repo);
        expect(test).toBe(0.125);
    });
    test("No Data Test", async () => {
        const repo: Repository = {
            QueryResult: undefined
        } as Partial<Repository> as Repository;
        // let number_of_dependencies = repo.QueryResult?.dependencyGraphManifests?.nodes.length; 
        const test = await VersionDependence_Scorer(repo);
        expect(test).toBe(1);
    });
});