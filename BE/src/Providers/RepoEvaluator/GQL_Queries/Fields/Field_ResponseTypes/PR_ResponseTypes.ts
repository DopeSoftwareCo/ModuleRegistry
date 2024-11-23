type PullRequestCommit = {
    oid: string;
    message: string;
    committedDate: string;
    author: {
        name: string;
        email: string;
    };
};

type PullRequestReview = {
    author: {
        login: string;
    };
    state: string;
    submittedAt: string;
};

export type PullRequestNode = {
    id: string;
    title: string;
    number: number;
    body: string;
    createdAt: string;
    updatedAt: string;
    state: "OPEN" | "CLOSED" | "MERGED";
    mergedAt: string | null;
    author: {
        login: string;
    };
    reviews: {
        nodes: PullRequestReview[];
    };
    commits: {
        nodes: {
            commit: PullRequestCommit;
        }[];
    };
};

type PullRequestEdge = {
    node: PullRequestNode;
};

export type PullRequestsQueryResult = {
    pullRequests: {
        edges: PullRequestEdge[];
    };
};

// GraphQLResponseTypes.ts
export type TotalCommitsResponse = {
    repository: {
        object: {
            history: {
                totalCount: number;
            };
        };
    };
};

export type PullRequestsResponse = {
    repository: {
        pullRequests: {
            nodes: any[];
            pageInfo: {
                hasNextPage: boolean;
                endCursor: string;
            };
        };
    };
};
