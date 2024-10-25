export type Query_RefType = { target?: { history: { edges?: [{ node: { author: { name: string } } }] } } };

export type ErrorLocation = {
    line: number;
    column: number;
};

export type ErrorLocations = ErrorLocation[];

export type RepositoryFromQuery = {
    name: string;
    description: string;
    repoUrl: string;
    fileUrl: string;
    [key: string]: string;
};

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
