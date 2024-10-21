import { ContributorNode } from "../QueryResponses/Contributors_ResponseTypes";
import { MergeCommitNode } from "../QueryResponses/Merges_ResponseTypes";
import { PullRequestNode } from "../QueryResponses/PR_ResponseTypes";
import { DependencyManifestNode } from "../QueryResponses/Dependency_ResponseTypes";

export type Query_RefType = { target?: { history: { edges?: [{ node: { author: { name: string } } }] } } };

export type ErrorLocation = {
    line: number;
    column: number;
};

export type ErrorLocations = ErrorLocation[];

export type GraphQLError = {
    type: string;
    path: string[];
    locations: ErrorLocations;
    message: string;
};

export interface GraphQLResponse<T> {
    data: T;
    errors?: GraphQLError[];
    message?: string;
    status?: string;
}

export type TestsFilesFromQuery = {
    name: string;
    type: string;
}[];

export type ContributorNodes = Array<ContributorNode>;
export type MergeCommitNodes = Array<MergeCommitNode>;
export type PullRequestNodes = Array<PullRequestNode>;
export type DependencyManifestNodes = Array<DependencyManifestNode>;

/*
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
    }>;*/
