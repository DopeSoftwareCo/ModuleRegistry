import { MergeCommitNode } from "../Fields/Field_ResponseTypes/Merges_ResponseTypes";
import { PullRequestNode } from "../Fields/Field_ResponseTypes/PR_ResponseTypes";
import { DependencyManifestNode } from "../Fields/Field_ResponseTypes/Dependency_ResponseTypes";

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

export type MergeCommitNodes = Array<MergeCommitNode>;
export type PullRequestNodes = Array<PullRequestNode>;
export type DependencyManifestNodes = Array<DependencyManifestNode>;
