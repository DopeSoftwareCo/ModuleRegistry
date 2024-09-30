/**
 * @author Ben Kanter
 * Accepts a repository
 * Pull number of open and closed issues to obtain score
 *
 * @param repo - Repository to be scored
 * @returns Score calculated by 1 - (open issues / total issues)
 */

import { Repository, NDJSONRow } from '../Types/DataTypes';
import { LogDebug } from '../Utils/log';

export function scoreCorrectness<T>(repo: Repository<T>): number {
    const openIssuesCount = repo.queryResult?.openIssues?.totalCount!;
    const closedIssuesCount = repo.queryResult?.closedIssues?.totalCount!;
    const totalIssuesCount = openIssuesCount + closedIssuesCount;

    LogDebug(`Open issues: ${openIssuesCount}`);
    LogDebug(`Closed issues: ${closedIssuesCount}`);

    if (closedIssuesCount == 0) {
        LogDebug('No Closed Issues');
        return 0;
    }

    const finalScore = 1 - openIssuesCount / totalIssuesCount;
    return finalScore;
}
