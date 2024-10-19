import { MergeRestriction_Scorer } from "../src/Providers/ModEval/Functions/DSincScorers";
import { TargetRepository } from "../src/Providers/ModEval/SingleClasses/TargetRepository";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";

describe("MergeRestriction_Scorer", () => {
    let repo: TargetRepository;

    beforeEach(() => {
        repo = new TargetRepository({
            url_info: { gitURL: "https://example.com/repo.git" },
            // other properties
        });

        jest.spyOn(repo, "SendQueryToGraphQL").mockImplementation(async () => {
            repo["totalCommits"] = 100;
            repo["totalPullRequestsWithReview"] = 80;
            return {
                totalCommits: 100,
                totalPullRequestsWithReview: 80,
                // other properties
            };
        });
    });

    it("should return a score based on the fraction of reviewed PR commits", async () => {
        const score = await MergeRestriction_Scorer(repo);
        expect(score).toBeCloseTo(5.6, 5); // 80% of 7
    });

    it("should return 0 if there are no commits", async () => {
        jest.spyOn(repo, "SendQueryToGraphQL").mockImplementation(async () => {
            repo["totalCommits"] = 0;
            repo["totalPullRequestsWithReview"] = 0;
            return {
                totalCommits: 0,
                totalPullRequestsWithReview: 0,
                // other properties
            };
        });

        const score = await MergeRestriction_Scorer(repo);
        expect(score).toBe(0);
    });

    it("should return -1 if the query fails", async () => {
        jest.spyOn(repo, "SendQueryToGraphQL").mockResolvedValue(undefined);

        const score = await MergeRestriction_Scorer(repo);
        expect(score).toBe(-1);
    });
});
