import { ModEvalProvider } from "modeval";
import fetch from "node-fetch";
import dotenv from "../../.env";

// Load environment variables from .env file
dotenv.config();

class PRMergeScorer {
    private modevalProvider: ModEvalProvider;
    private githubToken: string;

    constructor(modevalProvider: ModEvalProvider, githubToken: string) {
        this.modevalProvider = modevalProvider;
        this.githubToken = githubToken;
    }

    /**
     * Fetch data from GitHub GraphQL API.
     * @param repoUrl The GitHub repository URL.
     * @returns An object containing total lines and reviewed PR lines.
     */
    private async fetchGitHubData(repoUrl: string): Promise<{ totalLines: number; reviewedPRLines: number }> {
        const [owner, repo] = repoUrl.replace("https://github.com/", "").split("/");
        const query = `
            {
                repository(owner: "${owner}", name: "${repo}") {
                    pullRequests(states: MERGED, first: 100) {
                        nodes {
                            reviews(states: APPROVED) {
                                totalCount
                            }
                            additions
                        }
                    }
                    object(expression: "HEAD") {
                        ... on Commit {
                            history {
                                totalCount
                            }
                        }
                    }
                }
            }
        `;

        const response = await fetch("https://api.github.com/graphql", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${this.githubToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query }),
        });

        const data = await response.json();
        const totalLines = data.data.repository.object.history.totalCount;
        const reviewedPRLines = data.data.repository.pullRequests.nodes
            .filter((pr: any) => pr.reviews.totalCount > 0)
            .reduce((sum: number, pr: any) => sum + pr.additions, 0);

        return { totalLines, reviewedPRLines };
    }

    /**
     * Calculate the PR merge score.
     * @param repoUrl The GitHub repository URL.
     * @returns The fraction of code introduced through reviewed pull requests.
     */
    async calculateScore(repoUrl: string): Promise<number> {
        const { totalLines, reviewedPRLines } = await this.fetchGitHubData(repoUrl);
        if (totalLines === 0) {
            return 0;
        }
        return reviewedPRLines / totalLines;
    }
}

/**
 * Calculates the PR merge score for a given GitHub repository.
 *
 * @param repoUrl - The GitHub repository URL.
 * @returns A Promise that resolves to the fraction of code introduced through reviewed pull requests.
 *
 * @remarks
 * This function creates an instance of {@link PRMergeScorer}, fetches data from the GitHub GraphQL API,
 * and then calculates the PR merge score based on the total lines of code and the lines of code introduced
 * through reviewed pull requests.
 *
 * The GitHub token is retrieved from the environment variable `GITHUB_TOKEN`. If the token is not found,
 * an empty string is used.
 *
 * @example
 */

export async function PrMergeScore(repoUrl: string): Promise<number> {
    const modevalProvider = new ModEvalProvider();
    const githubToken = process.env.GITHUB_TOKEN || "";
    const prMergeScorer = new PRMergeScorer(modevalProvider, githubToken);
    const repositoryUrl = repoUrl;
    return prMergeScorer.calculateScore(repositoryUrl);
}
