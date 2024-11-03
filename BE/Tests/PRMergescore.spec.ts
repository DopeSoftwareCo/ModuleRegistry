import { MergeRestriction_Scorer } from "../src/Providers/ModEval/Functions/DSincScorers";
import { Repository } from "../src/Providers/ModEval/RepoComponents/Repository";
import { SendRequestToGQL } from "../src/Providers/ModEval/GQL_Queries/Requests/GQLRequests";
import { beforeEach, describe, it, expect, jest, afterEach } from "@jest/globals";
import { RepoID } from "../src/Providers/ModEval/RepoComponents/ID/RepoID";
// Mock RepoURL since it's an interface and cannot be instantiated
jest.mock("../src/Providers/ModEval/RepoComponents/URL/URLProcessor.interface", () => ({
    RepoURL: jest.fn().mockImplementation(() => ({
        url: "https://github.com/owner/repo",
    })),
}));
import { RepoURL } from "../src/Providers/ModEval/RepoComponents/URL/URLProcessor.interface";

jest.mock("../src/Providers/ModEval/GQL_Queries/Requests/GQLRequests");

describe("MergeRestriction_Scorer", () => {
    let repo: Repository;

    beforeEach(() => {
        repo = new Repository(new RepoID("owner", "repo"), new RepoURL("https://github.com/owner/repo"));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return a score of 1 when all PRs are reviewed", async () => {
        (SendRequestToGQL as jest.Mock).mockResolvedValue({
            data: {
                repository: {
                    pullRequests: {
                        nodes: [
                            { additions: 100, reviews: { totalCount: 1 } },
                            { additions: 200, reviews: { totalCount: 1 } },
                        ],
                    },
                },
            },
        });

        const score = await MergeRestriction_Scorer(repo);
        expect(score).toBe(1);
    });

    it("should return a score of 0 when no PRs are reviewed", async () => {
        (SendRequestToGQL as jest.Mock).mockResolvedValue({
            data: {
                repository: {
                    pullRequests: {
                        nodes: [
                            { additions: 100, reviews: { totalCount: 0 } },
                            { additions: 200, reviews: { totalCount: 0 } },
                        ],
                    },
                },
            },
        });

        const score = await MergeRestriction_Scorer(repo);
        expect(score).toBe(0);
    });

    it("should return a correct score when some PRs are reviewed", async () => {
        (SendRequestToGQL as jest.Mock).mockResolvedValue({
            data: {
                repository: {
                    pullRequests: {
                        nodes: [
                            { additions: 100, reviews: { totalCount: 1 } },
                            { additions: 200, reviews: { totalCount: 0 } },
                        ],
                    },
                },
            },
        });

        const score = await MergeRestriction_Scorer(repo);
        expect(score).toBe(0.33);
    });

    it("should handle empty pull request data gracefully", async () => {
        (SendRequestToGQL as jest.Mock).mockResolvedValue({
            data: {
                repository: {
                    pullRequests: {
                        nodes: [],
                    },
                },
            },
        });

        const score = await MergeRestriction_Scorer(repo);
        expect(score).toBe(0);
    });

    it("should throw an error when the data is invalid", async () => {
        (SendRequestToGQL as jest.Mock).mockResolvedValue({
            data: {
                repository: null,
            },
        });

        await expect(MergeRestriction_Scorer(repo)).rejects.toThrow("Failed to fetch pull requests data");
    });
});
