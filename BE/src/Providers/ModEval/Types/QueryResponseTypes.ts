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


export type BaseRepoQueryResponse = 
{    
    name: string;
    url: string;
    description: string;
    
    
    licenseInfo?:
    { 
        name: string; 
    };
    openIssues?: {
        totalCount: number;
    };
    closedIssues?: {
        totalCount: number;
    };
    stargazerCount?: number;
    ref?: { target?: { history: { edges?: [{ node: { author: { name: string } } }] } } };
    readmeFile?: { text: string };
    testsCheckMain?: { entries: TestsFilesFromQuery };
    testsCheckMaster?: { entries: TestsFilesFromQuery };
}


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