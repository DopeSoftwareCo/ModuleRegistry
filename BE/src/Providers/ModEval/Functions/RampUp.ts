import { Repository } from "../RepoComponents/Repository";
import { LogDebug } from "../../Utils/Log";

/**
 * @author Ben Kanter
 * Gets the amount of stars a repo has
 * Divide it by a benchmark derrived from one of the most popular packages on NodeJS https://github.com/expressjs/express
 * It will likely end up as a low score, but it is
 *
 * @param repo - input repository
 * @return 1 - ratio of stars to benchmark
 */
export function ScoreRampupTime(repo: Repository): number {
    const result = repo.QueryResult;
    if (!result) {
        return 0;
    }

    const readmeSize = result.README?.text.length;
    const benchmark = 10000;
    if (readmeSize == undefined) {
        LogDebug("Readme size was not defined for comparison");
        return 0;
    }
    const finalScore = Math.min(readmeSize / benchmark, 1);

    return finalScore;
}
