import { GeneralConfig } from '../../Config/config';
import { PackageMetaDataFromAPI } from '../../Models/Models';

/**
 * @author Jorge Puga Hernandez
 * @description - Sends a request to the backend to fetch package data based on a specific version type and request.
 * - This function contains the frontend logic works with the BE /packages endpoint to display the appropriate packages.
 *
 * @param {string} versionType - The type of version request (e.g., 'Exact', 'Bounded Range', 'Carat', 'Tilde').
 * @param {string} request - The version request string (e.g., '1.2.3', '1.2.3-2.1.0', '^1.2.3', '~1.2.0').
 * @param {string} projectName - The name of the package being requested.
 * @param errorSetter - A function to handle error messages.
 *
 * @returns {Promise<PackageMetaDataFromAPI[] | undefined>} An array of package metadata if successful, otherwise undefined.
 */
export const getPackagesRequest = async (
    versionType: string,
    request: string,
    projectName: string,
    errorSetter: (error: string) => void
): Promise<PackageMetaDataFromAPI[] | undefined> => {
    try {
        const response = await fetch(`${GeneralConfig.BACKEND_URL}packages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${localStorage.getItem('token')}`,
            },

            // This follows the schema for /packages request body.
            body: JSON.stringify({
                Version: `${versionType} (${request})`,
                Name: projectName,
            }),
        });

        if (!response.ok) {
            const responseText = await response.text();
            errorSetter(responseText);
            return undefined;
        }

        const packagesData: PackageMetaDataFromAPI[] = await response.json();
        return packagesData;
    } catch (err) {
        if (err instanceof Error) {
            errorSetter(err.message);
        } else {
            errorSetter('An unknown error occurred in getPackagesRequest.');
        }
    }
};
