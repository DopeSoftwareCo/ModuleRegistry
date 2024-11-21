export type Author = {
    name: string;
    email: string;
};

export type CommitNode = {
    oid: string; // Commit SHA (ID)
    message: string; // Commit message
    committedDate: string; // Date when the commit was made
    author: Author | null; // Commit author (can be null)
};

export type CommitEdge = {
    node: CommitNode; // Commit details
    cursor: string; // Cursor for pagination
};

export type PageInfo = {
    hasNextPage: boolean; // Whether there is another page of commits
    endCursor: string | null; // The cursor for fetching the next page
};

export type CommitHistory = {
    edges: CommitEdge[]; // Array of commits with pagination cursors
    pageInfo: PageInfo; // Info about pagination
};

export type RepositoryRef = {
    target: {
        history: CommitHistory; // The commit history
    };
};

export type Repository = {
    ref: RepositoryRef;
};

export type CommitQueryResult = {
    data: {
        repository: Repository; // Repository containing the commit history
    };
};

export const Empty_CommitHistory: CommitHistory = {
    edges: [],
    pageInfo: {
        hasNextPage: false,
        endCursor: null,
    },
};
