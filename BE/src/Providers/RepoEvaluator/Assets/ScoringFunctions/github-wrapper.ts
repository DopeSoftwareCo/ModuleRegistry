import { Util } from "../Requests/Util";
import { LogDebug } from "../../../../Utils/Log";

if (!Util.Constants.GITHUB_TOKEN) {
    LogDebug("Error: GITHUB_TOKEN is not set in the environment.");
}

/**
 * Parse a GitHub repository URL to extract the owner and repository name.
 *
 * @param url - GitHub repository URL.
 * @returns An object containing the owner and repository name, or null if the URL is invalid.
 */
export function parseGithubUrl(url: string): { owner: string; repo: string } | null {
    const match = url.match(/https:\/\/github\.com\/([^/]+)\/([^/]+)/);
    if (match && match[1] && match[2]) {
        return { owner: match[1], repo: match[2] };
    }
    return null;
}

/**
 * Fetch the license information from a GitHub repository.
 *
 * @param owner - The repository owner (either username or organization).
 * @param repo - The name of the repository.
 * @returns The license information as a string.
 * @throws Will throw an error if the license cannot be retrieved.
 */
export async function fetchRepoLicense(owner: string, repo: string) {
    try {
        const response = await fetch(`${Util.Constants.GITHUB_API_BASE_URL}/repos/${owner}/${repo}/license`, {
            headers: {
                Authorization: `token ${Util.Constants.GITHUB_TOKEN}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: any = await response.json();

        // Check to see if the license is compatible or not
        if (String(data.license.name) !== "Other") {
            // If the license is NOT equal to "Other", then it is compatible and return 1
            return 1;
        } else {
            // If the license is equal to "Other", return 0, since the license is not compatible
            return 0;
        }
    } catch (error) {
        console.error(`ERROR! Failed to retrieve license information for ${owner}/${repo}: ${error}`);
        throw error;
    }
}
