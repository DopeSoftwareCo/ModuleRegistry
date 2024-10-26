/**
 * Please see the individual function documentation for information.
 * This module processes handles the request to GQL
 * @author DSinc
 */
import { GITHUB_TOKEN } from "../../Assets/Octavo/src/Util/constant";
import { GraphQLResponse } from "../Reponse/RepoQueryResult.types";
import { RepoID } from "../../RepoComponents/ID/RepoID";
import { LogDebug, LogInfo } from "../../../Utils/Log";
import chalk from "chalk";
import { defaultFields, extraFields } from "../Fields/Field.const";

const GITHUB_API_BASE_URL = "https://api.github.com/graphql"; // GitHub GraphQL API URL

//const DEFAULT_FIELDS: string[] = [];

export const RepoQueryBuilder = <T>(repos: Array<RepoID>, bonusFields: string[] = extraFields): string => {
    return `
        query {
            ${repos
                .map((repo, idx) => {
                    return `    
                repo${idx}: repository(owner: "${repo.Owner}", name: "${repo.Name}") {
                                ${[...defaultFields, ...bonusFields].join("\n")}
                                  
                            }
                        `;
                })
                .join("\n")}
        }
    `;
};

export const SendRequestToGQL = async <T>(query: string): Promise<GraphQLResponse<T> | undefined> => {
    if (!process.env.GITHUB_TOKEN) {
        throw new Error("TOKEN NOT SET");
    }
    const endpoint = "https://api.github.com/graphql";
    const token = process.env.GITHUB_TOKEN;
    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ query }),
        });
        const result: GraphQLResponse<T> = await response.json();
        if (result.message || (result.status && !result.data)) {
            throw new Error(
                `GQL Response returned a message: ${result.message} with a code: ${result.status}. ${
                    result.message?.includes("credentials") || result.status === "401" ? "INVALID TOKEN" : ""
                }`
            );
        }
        return result;
    } catch (err) {
        throw new Error(
            err instanceof Error
                ? `ERR IN GQL ${chalk.red(err.message)}`
                : "An unknown error occured in requestFromGQL"
        );
    }
};

export async function FetchUniqueAuthors(
    owner: string,
    repo: string,
    existingAuthors = new Set<string>()
): Promise<Array<string> | undefined> {
    const authorsSet = new Set(existingAuthors); // Initialize with existing authors
    let hasNextPage = true; // Flag to check if there are more pages
    let endCursor = null; // To keep track of the cursor for pagination

    while (hasNextPage) {
        const query: string = `
            query {
                repository(owner: "${owner}", name: "${repo}") {
                    ref(qualifiedName: "main") {
                        target {
                            ... on Commit {
                                history(first: 10, after: ${endCursor ? `"${endCursor}"` : null}) {
                                    edges {
                                        node {
                                            author {
                                                name
                                                email
                                            }
                                        }
                                        cursor
                                    }
                                    pageInfo {
                                        hasNextPage
                                        endCursor
                                    }
                                }
                            }
                        }
                    }
                }
            }
        `;

        try {
            const response = await fetch(`${GITHUB_API_BASE_URL}/graphql`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${GITHUB_TOKEN}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            const commits = data.data.repository.ref.target.history.edges;

            // Extract authors and store them in the Set
            commits.forEach((edge: any) => {
                const author = edge.node.author;
                if (author) {
                    authorsSet.add(author.name); // Only add unique authors
                }
            });

            // Update pagination variables
            hasNextPage = data.data.repository.ref.target.history.pageInfo.hasNextPage;
            endCursor = data.data.repository.ref.target.history.pageInfo.endCursor;
        } catch (error) {
            LogDebug(`Error fetching authors: ${error}`);
            return undefined; // Re-throw the error after logging
        }
    }

    // Convert the Set to an array and return
    return Array.from(authorsSet);
}
