import { GraphQLResponse } from "./Types/QueryResponseTypes";
import { RepositoryIdentification } from "./Types/RepoComponents";

import chalk from "chalk";

const DEFAULT_FIELDS: string[] = [];

export const RepoQueryBuilderNew = <T>(
    repos: Array<RepositoryIdentification>,
    extraFields?: string[]
): string => {
    return `
        query {
            ${repos
                .map((repo, idx) => {
                    return `    
                repo${idx}: repository(owner: "${repo.owner}", name: "${repo.repoName}") {
                                ${[...DEFAULT_FIELDS, ...(extraFields ?? [])].join("\n")}
                                  
                            }
                        `;
                })
                .join("\n")}
        }
    `;
};

export const RequestFromGQLNew = async <T>(query: string): Promise<GraphQLResponse<T> | undefined> => {
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
