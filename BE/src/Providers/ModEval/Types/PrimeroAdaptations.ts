

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