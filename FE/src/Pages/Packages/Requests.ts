import { GeneralConfig } from '../../Config/config';
import { PackageMetaDataFromAPI } from '../../Models/Models';

/**
 * @author Jorge Puga Hernandez
 * @description - Sends a request to the backend to fetch package data based on a specific version type and request.
 * - This function contains the frontend logic works with the BE /packages endpoint to display the appropriate packages.
 *
 * @param {string} request - The version request string (e.g., '1.2.3', '1.2.3-2.1.0', '^1.2.3', '~1.2.0').
 * @param {string} packageName - The name of the package being requested or '*' for all packages.
 * @param errorSetter - A function to handle error messages.
 *
 * @returns An array of package metadata and an optional next offset if successful, otherwise undefined.
 */
export const getPackagesRequest = async (
    request: string,
    packageName: string,
    errorSetter: (error: string) => void
): Promise<{ data: PackageMetaDataFromAPI[]; nextOffset?: string } | undefined> => {
    try {
        // If the package name is '*', provide an array with a single query whose name is '*'.
        // Otherwise, send the name and the version request to the backend.
        const bodyPayload =
            packageName === '*' ? [{ Name: '*' }] : [{ Name: packageName, Version: request.trim() }];

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
