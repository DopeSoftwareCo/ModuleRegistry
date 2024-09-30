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

export type RepositoryFromQuery = {
    name: string;
    description: string;
    repoUrl: string;
    fileUrl: string;
    [key: string]: string;
};
export type ReposFromQuery<T> = {
    [key: string]: ({ owner: { login: string }; name: string; url: string; description: string } & T) | null;
};

export interface GraphQLResponse<T> {
    data: T;
    errors?: GraphQLError[];
}

export interface NPMRegistryResponse {
    repository?: {
        type?: string;
        url?: string;
    };
}

type RepoQueryResult = {
    description: string;
    name: string;
    url: string;
};
export interface BaseRepoQueryResponse {
    name: string;
    description: string;
    url: string;
}
