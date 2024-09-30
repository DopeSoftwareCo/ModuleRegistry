import { GraphQLResponse } from '../../Types/ResponseTypes';
import { LogDebug } from '../../Utils/log';

/**
 * @author John Leidy
 * @description This function is responsible for sending our query string to the GitHub GQL API.
 * @param query The query string built from our query builder {@type string}
 * @returns a promise {@type Promise<GraphQLResponse<T> | undefined>}
 */
export const requestFromGQL = async <T>(query: string): Promise<GraphQLResponse<T> | undefined> => {
    if (!process.env.GITHUB_TOKEN) {
        throw new Error('TOKEN NOT SET');
    }
    const endpoint = 'https://api.github.com/graphql';
    const token = process.env.GITHUB_TOKEN;

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ query }),
        });
        const result: GraphQLResponse<T> = await response.json();
        return result;
    } catch (err) {
        LogDebug(err instanceof Error ? err.message : 'An unknown error occured in requestFromGQL');
        return undefined;
    }
};
