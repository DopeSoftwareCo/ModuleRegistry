import chalk from "chalk";
import { Repository } from "../RepoComponents/Repository";
import { LogDebug, LogInfo } from "../../Utils/Log";
import { RepoQueryResult } from "../GQL_Queries/Reponse/RepoQueryResult";

/**
 * @author Ben Kanter
 * Accepts a repository
 * Pull number of open and closed issues to obtain score
 *
 * @param repo - Repository to be scored
 * @returns Score calculated by 1 - (open issues / total issues)
 */

const hasTests = <T>(repo: Repository) => {
    const result = repo.QueryResult;
    const testDirs = ["tests", "test", "e2e", "testing", "spec"];

    if (result?.TestsCheck_Master) {
        LogInfo(`Repo ${repo.ID.Name} had a master branch, checking if it has test dir`);
        return result?.TestsCheck_Master.entries.some((entry) => testDirs.includes(entry.name));
    } else if (result?.TestsCheck_Main) {
        LogInfo(`Repo ${repo.ID.Name} had a main branch, checking if it has test dir`);
        return result?.TestsCheck_Main.entries.some((entry) => testDirs.includes(entry.name));
    }
};

export function ScoreCorrectness<T>(repo: Repository): number {
    if (!repo.QueryResult) {
        return 0;
    }

    const result: RepoQueryResult = repo.QueryResult;
    const tests = hasTests(repo);

    LogInfo(`Repo: ${repo.ID.Name} ${tests ? "has" : "does not have"} tests`);
    const goodRatio = 0.1;
    const open = result.OpenIssueCount;
    const closed = result.ClosedIssueCount;
    LogDebug(`Open issues: ${open}`);
    LogDebug(`Closed issues: ${closed}`);
    if (result.ClosedIssueCount === 0) {
        LogDebug("No Closed Issues");
        return 0;
    }

    if (open == undefined || closed == undefined) {
        return 0;
    }
    const ratio = open / closed;
    let score = ratio / goodRatio;

    if (tests) {
        score = Math.max(0.5, score);
    } else {
        score = Math.min(score, 0.49);
    }
    LogInfo(`Score ${!tests ? "should be" : "should not be"} less than 5`);
    LogInfo(
        tests
            ? `${chalk.green(`${repo.ID.Name} HAS TESTS, final score: ${Math.min(score, 1)}`)}`
            : `${chalk.red(`${repo.ID.Name} DOES NOT HAVE TESTS, final score ${Math.min(score, 1)}`)}`
    );
    return Math.min(score, 1);
}
