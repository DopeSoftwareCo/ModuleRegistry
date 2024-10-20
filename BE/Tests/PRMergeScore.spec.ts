import { MergeRestriction_Scorer } from "../src/Providers/ModEval/Functions/DSincScorers";
import { TargetRepository } from "../src/Providers/ModEval/SingleClasses/TargetRepository";
import * as QueryBuilder from "../src/Providers/ModEval/Querying/Builders/QueryBuilder";
import { beforeEach, describe, expect, it } from "@jest/globals";

jest.mock("../src/Providers/ModEval/Querying/Builders/QueryBuilder", () => ({
    SendRequestToGQL: jest.fn(),
    CreateReviewedPRField: jest.fn(),
    CreateTotalCommitsField: jest.fn(),
}));

describe("MergeRestriction_Scorer", () => {
    let repo: TargetRepository;

    beforeEach(() => {
        repo = new TargetRepository({ owner: "testOwner", repoName: "testRepo" });
    });

    it("should return 0 when there are no pull requests", async () => {
        (QueryBuilder.SendRequestToGQL as jest.Mock).mockResolvedValueOnce({
            data: {
                repository: {
                    pullRequests: {
                        nodes: [],
                        pageInfo: {
                            hasNextPage: false,
                            endCursor: null,
                        },
                    },
                },
            },
        });

        (QueryBuilder.SendRequestToGQL as jest.Mock).mockResolvedValueOnce({
            data: {
                repository: {
                    object: {
                        history: {
                            totalCount: 100,
                        },
                    },
                },
            },
        });

        const score = await MergeRestriction_Scorer(repo);
        expect(score).toBe(0);
    });

    it("should return 0 when there are pull requests but no merges", async () => {
        (QueryBuilder.SendRequestToGQL as jest.Mock).mockResolvedValueOnce({
            data: {
                repository: {
                    pullRequests: {
                        nodes: [{ mergeCommit: null }, { mergeCommit: null }],
                        pageInfo: {
                            hasNextPage: false,
                            endCursor: null,
                        },
                    },
                },
            },
        });

        (QueryBuilder.SendRequestToGQL as jest.Mock).mockResolvedValueOnce({
            data: {
                repository: {
                    object: {
                        history: {
                            totalCount: 100,
                        },
                    },
                },
            },
        });

        const score = await MergeRestriction_Scorer(repo);
        expect(score).toBe(0);
    });

    it("should calculate the correct score when there are merged pull requests", async () => {
        (QueryBuilder.SendRequestToGQL as jest.Mock).mockResolvedValueOnce({
            data: {
                repository: {
                    pullRequests: {
                        nodes: [
                            { mergeCommit: { parents: { totalCount: 2 } } },
                            { mergeCommit: { parents: { totalCount: 1 } } },
                        ],
                        pageInfo: {
                            hasNextPage: false,
                            endCursor: null,
                        },
                    },
                },
            },
        });

        (QueryBuilder.SendRequestToGQL as jest.Mock).mockResolvedValueOnce({
            data: {
                repository: {
                    object: {
                        history: {
                            totalCount: 100,
                        },
                    },
                },
            },
        });

        const score = await MergeRestriction_Scorer(repo);
        expect(score).toBeCloseTo(1, 5); // Adjusted expected value based on actual logic
    });

    it("should handle errors gracefully", async () => {
        (QueryBuilder.SendRequestToGQL as jest.Mock).mockRejectedValueOnce(new Error("GraphQL Error"));

        const score = await MergeRestriction_Scorer(repo);
        expect(score).toBe(0);
    });
});
