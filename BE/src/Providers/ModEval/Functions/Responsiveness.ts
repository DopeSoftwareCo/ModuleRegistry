import { Repository } from "../RepoComponents/Repository";

/**
 * Tim Carpenter
 *
 * Evaluates the responsiveness score of a repository as a ratio of open and closed issues
 *
 * @template T - The type of the data stored in the repository (generic)
 * @param {Repository} repo - The repository to be evaluated
 * @returns 0-1 - Score between 0 and 1
 *
 */
export function ScoreReponsiveness(repo: Repository): number {
    const result = repo.QueryResult;
    if (!result) {
        return 0;
    }

    const open = result.OpenIssueCount;
    const closed = result.ClosedIssueCount;

    if (open == undefined || closed == undefined) {
        return 0;
    }
    const goodRatio = 2;
    const ratio = open / closed;
    var score = Math.min(ratio / goodRatio, 1);

    // If issues can't be found, score is NaN, must be set to 0
    if (Number.isNaN(score)) {
        score = 0;
    }

    return score;
}
