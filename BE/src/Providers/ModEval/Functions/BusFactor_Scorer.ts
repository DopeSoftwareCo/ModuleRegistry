import { Repository } from "../RepoComponents/Repository";
const git = require("isomorphic-git");
import * as fileSystem from "fs";
import { LogDebug } from "../../Utils/Log";
const http = require("isomorphic-git/http/node");

const DUMP_DIRECTORY = "../REPO_DUMP";

export type Contributor = {
    name: string;
    commitCount: number;
};

type CC = { [key: string]: number };

const countCommits = (log: any): { [key: string]: number } | undefined => {
    const res: CC = {};
    if (log) {
        log.forEach((logItem: any) => {
            if (logItem.commit && logItem.commit.author && logItem.commit.author.name) {
                if (Object.keys(res).includes(logItem.commit.author.name)) {
                    res[logItem.commit.author.name] += 1;
                } else {
                    res[logItem.commit.author.name] = 1;
                }
            }
        });
    }
    return Object.keys(res).length > 0 ? res : undefined;
};

const filterLow = (contributors: CC | undefined) => {
    let store: CC = {};
    if (contributors) {
        Object.entries(contributors).forEach((contributor) => {
            if (contributor[1] > 5) {
                store[contributor[0]] = contributor[1];
            }
        });
    }
    return Object.keys(store).length > 0 ? store : undefined;
};

function removeRepo(directory: string) {
    if (fileSystem.existsSync(directory)) {
        fileSystem.rmSync(directory, { recursive: true, force: true });
        LogDebug(`Repository at ${directory} has been removed.`);
    } else {
        LogDebug(`Directory ${directory} does not exist.`);
    }
}

const handleRepoClone = async (repoDirectory: string, repo: Repository) => {
    try {
        if (!repo.QueryResult) {
            return 0;
        }
        await git.clone({
            fs: fileSystem,
            http,
            singleBranch: true,
            dir: repoDirectory,
            url: repo.QueryResult.GitURL,
        });
    } catch (err) {
        if (err instanceof Error) {
            LogDebug(err.message);
        } else {
            LogDebug("unknown error curred in handleRepoClone");
        }
        removeRepo(repoDirectory);
    }
};

const getGitLog = async (repoDirectory: string, depth: number) => {
    try {
        const gitLog = await git.log({
            fs: fileSystem,
            dir: repoDirectory,
            depth: depth,
        });
        return gitLog;
    } catch (err) {
        if (err instanceof Error) {
            LogDebug(err.message);
            return undefined;
        } else {
            LogDebug("Unknown error occurred getting git log.");
            return undefined;
        }
    }
};

const calculateScore = (filteredContributors: CC | undefined, maxExpectedContributors: number) => {
    if (filteredContributors) {
        return Math.min(1, Object.keys(filteredContributors).length / maxExpectedContributors);
    } else {
        return 0;
    }
};

const ensureRepoDumpExists = () => {
    if (!fileSystem.existsSync(DUMP_DIRECTORY)) {
        fileSystem.mkdirSync(DUMP_DIRECTORY);
    }
};

export async function ScoreBusFactor<T>(repo: Repository): Promise<number> {
    ensureRepoDumpExists();
    let score = 0;
    const repoDirectory = `${DUMP_DIRECTORY}/${repo.ID.Name}`;
    try {
        await handleRepoClone(repoDirectory, repo);
        const gitLog = await getGitLog(repoDirectory, 100);
        const res = countCommits(gitLog);
        const fil = filterLow(res);
        score = calculateScore(fil, 10);
        removeRepo(repoDirectory);
    } catch (err) {
        LogDebug(err instanceof Error ? err.message : "unkown error occured");
    }
    return score;
}
