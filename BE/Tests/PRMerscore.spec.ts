import { MergeRestriction_Scorer } from "../src/Providers/ModEval/Functions/DSincScorers";
import { Repository } from "../src/Providers/ModEval/RepoComponents/Repository";
import { SendRequestToGQL } from "../src/Providers/ModEval/GQL_Queries/Builders/QueryBuilder";
import { beforeEach, describe, it, expect, jest } from "@jest/globals";
import { Generate_RepositoryID } from "../src/Providers/ModEval/RepoComponents/ID/RepoID";
import { fail } from "assert";

jest.mock("../src/Providers/ModEval/Querying/Builders/QueryBuilder");
jest.mock("../src/Providers/ModEval/Querying/Builders/QueryFields");

describe("MergeRestriction_Scorer", () => {
    let repo: Repository;

    beforeEach(() => {
        repo = new Repository({ owner: "testOwner", repoName: "testRepo" });
    });

    it("should return 0 when there are no pull requests", async () => {
        (SendRequestToGQL as jest.Mock).mockResolvedValueOnce({
            data: {
                repository: {
                    pullRequests: {
                        nodes: [] as any[],
                        pageInfo: {
                            hasNextPage: false,
                            endCursor: null,
                        },
                    },
                },
            },
        });

        (SendRequestToGQL as jest.Mock).mockResolvedValueOnce({
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

    it("should return 0 when there are pull requests but no merge commits", async () => {
        (SendRequestToGQL as jest.Mock).mockResolvedValueOnce({
            data: {
                repository: {
                    pullRequests: {
                        nodes: [{ mergeCommit: null }] as any[],
                        pageInfo: {
                            hasNextPage: false,
                            endCursor: null,
                        },
                    },
                },
            },
        });

        (SendRequestToGQL as jest.Mock).mockResolvedValueOnce({
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

    it("should return 0 when there are pull requests but no merge commits with multiple parents", async () => {
        (SendRequestToGQL as jest.Mock).mockResolvedValueOnce({
            data: {
                repository: {
                    pullRequests: {
                        nodes: [{ mergeCommit: { parents: { totalCount: 1 } } }] as any[],
                        pageInfo: {
                            hasNextPage: false,
                            endCursor: null,
                        },
                    },
                },
            },
        });

        (SendRequestToGQL as jest.Mock).mockResolvedValueOnce({
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

    it("should generate repository ID and calculate merge restriction score", async () => {
        const repoID = await Generate_RepositoryID("https://github.com/cloudinary/cloudinary_npm");

        (SendRequestToGQL as jest.Mock).mockResolvedValueOnce({
            data: {
                repository: {
                    pullRequests: {
                        nodes: [
                            { mergeCommit: { parents: { totalCount: 2 } } },
                            { mergeCommit: { parents: { totalCount: 1 } } },
                        ] as any[],
                        pageInfo: {
                            hasNextPage: false,
                            endCursor: null,
                        },
                    },
                },
            },
        });

        (SendRequestToGQL as jest.Mock).mockResolvedValueOnce({
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

        //const repoID = await Generate_RepositoryID("https://github.com/cloudinary/cloudinary_npm");
        if (repoID) {
            const repo = new Repository(repoID);
            const result = await MergeRestriction_Scorer(repo);
            expect(result).toBeCloseTo(1, 2); // Adjusted precision
        } else {
            fail("Repository ID generation failed");
        }
    });
});
