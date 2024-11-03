/**
 * Please see the individual function documentation for information.
 * This module processes handles the request to GQL
 * @author DSinc
 */
import dotenv from "dotenv";
dotenv.config();

import { GraphQLResponse } from "../Reponse/RepoQueryResult.types";
import { RepoID } from "../../RepoComponents/ID/RepoID";
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

/**
 * @author John Leidy
 * @description Builds a query that shows the fields available for repositories
 * @returns a string to use for a query! {@type string}
 */
export const buildRepoSchemaQuery = (): string => {
    return `
       query {
        __type(name: "Repository") {
                name
                kind
                description
                fields {
                    name
                }
            }
        }

    `;
};

export const SendRequestToGQL = async <T>(query: string): Promise<GraphQLResponse<T> | undefined> => {
    if (!process.env.GITHUB_TOKEN) {
        throw new Error("TOKEN NOT SET");
    }
    const endpoint = GITHUB_API_BASE_URL;
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
