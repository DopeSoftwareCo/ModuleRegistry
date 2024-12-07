import { GeneralConfig } from '../../Config/config';
import { PackageMetaDataFromAPI } from '../../Models/Models';

/**
 * @author Jorge Puga Hernandez
 * @description Sends a request to the BE to fetch package data based on an array of queries.
 *
 * @param queries - An array of package queries. Each query includes a Name and Version (optional).
 * @param errorSetter - A function to handle error messages.
 *
 * @returns An array of package metadata and an optional next offset if successful, otherwise undefined.
 */
export const getPackagesRequest = async (
    queries: { Name: string; Version?: string }[],
    errorSetter: (error: string) => void
): Promise<{ data: PackageMetaDataFromAPI[]; nextOffset?: string } | undefined> => {
    try {
        // If the array contains a single query with Name: "*", request all packages from the BE.
        const bodyPayload = queries.length === 1 && queries[0].Name === '*' ? [{ Name: '*' }] : queries;

        // Otherwise get the packages that satisfy the queries in the array.
        const response = await fetch(`${GeneralConfig.BACKEND_URL}packages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(bodyPayload),
        });

        if (!response.ok) {
            const responseText = await response.text();
            errorSetter(responseText);
            return undefined;
        }

        const packagesData: PackageMetaDataFromAPI[] = await response.json();
        return { data: packagesData };
    } catch (err) {
        if (err instanceof Error) {
            errorSetter(err.message);
        } else {
            errorSetter('An unknown error occurred in getPackagesRequest.');
        }
    }
};
