export type ContributorNode = {
    login: string;
    name: string | null;
    contributionsCollection: {
        contributionCalendar: {
            totalContributions: number;
        };
    };
    email: string | null;
    avatarUrl: string;
};

export type ContributorEdge = {
    node: ContributorNode;
};

export type ContributorsQueryResult = {
    collaborators: {
        edges: ContributorEdge[];
    };
};
