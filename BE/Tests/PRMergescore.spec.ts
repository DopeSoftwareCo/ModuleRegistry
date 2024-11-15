import { MergeRestriction_Scorer } from "../src/Providers/RepoEvaluator/Functions/DSincScorers";
import { Repository } from "../src/Providers/RepoEvaluator/RepoComponents/Repository";
import { SendRequestToGQL } from "../src/Providers/RepoEvaluator/GQL_Queries/Requests/GQLRequests";
import { beforeEach, describe, it, expect, jest, afterEach } from "@jest/globals";
import { RepoID } from "../src/Providers/RepoEvaluator/RepoComponents/ID/RepoID";
import { RepoURL } from "../src/Providers/RepoEvaluator/RepoComponents/URL/URLProcessor.interface";
import { SuperRepoBuilder } from "../src/Providers/RepoEvaluator/RepoComponents/Builders/SuperRepoBuilder";
jest.mock("../src/Providers/ModEval/RepoComponents/URL/URLProcessor.interface", () => ({
    RepoURL: jest.fn().mockImplementation(() => ({
        url: "https://github.com/owner/repo",
    })),
}));

jest.mock("../src/Providers/ModEval/GQL_Queries/Requests/GQLRequests");

describe("MergeRestriction_Scorer", () => {
    let repo: Repository;

    beforeEach(async () => {
        const superRepoBuilder = new SuperRepoBuilder();
        const myRepo = await superRepoBuilder.SuperBuild("https://github.com/owner/repo");
        if (myRepo) {
            repo = myRepo;
        }
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
        } as unknown as never);

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
        } as unknown as never);

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
        } as unknown as never);

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
        } as unknown as never);

        const score = await MergeRestriction_Scorer(repo);
        expect(score).toBe(0);
    });

    it("should throw an error when the data is invalid", async () => {
        (SendRequestToGQL as jest.Mock).mockResolvedValue({
            data: {
                repository: null,
            },
        } as unknown as never);

        await expect(MergeRestriction_Scorer(repo)).rejects.toThrow("Failed to fetch PR data");
    });
});
