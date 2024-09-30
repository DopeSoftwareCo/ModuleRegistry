/**
 * @author Ben Kanter
 * Gets the amount of stars a repo has
 * Divide it by a benchmark derrived from one of the most popular packages on NodeJS https://github.com/expressjs/express
 * It will likely end up as a low score, but it is
 *
 * @param repo - input repository
 * @return 1 - ratio of stars to benchmark
 */
import { repoQueryBuilder } from '../Requests/QueryBuilders/repos';
import { Repository, NDJSONRow } from '../Types/DataTypes';
import { LogDebug } from '../Utils/log';

export function scoreRampupTime<T>(repo: Repository<T>): number {
    const starsCount = repo.queryResult?.stargazerCount;
    const benchmark = 50000;
    if (starsCount == undefined) {
        LogDebug('Stars count was undefined in score ramp up time.');
        return 0;
    }
    const finalScore = 1 - starsCount / benchmark;

    return finalScore;
}
