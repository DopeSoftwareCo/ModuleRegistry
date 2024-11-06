import { GeneralConfig } from '../../Config/config';
import { PackageCost } from '../../../../BE/src/Types/Models';

/**
 * @author Jorge Puga Hernandez
 * @description - The backend provides the size cost endpoint which will retrieve the cost information
 * following the schema. Here, we will fetch the data from the backend endpoint by passing the id and
 * optional dependency boolean parameter. We will then display the size cost with or without dependencies.
 * There is also some error handling just in case something goes wrong.
 *
 * @param {string} id - The unique ID of the package. We will use this to request the cost information.
 * @param {boolean} dependency - Indicates whether the cost information should include dependencies or not.
 * @param errorSetter - A function that will handle error messages.
 *
 * @returns {Promise<PackageCost | undefined>} - PackageCost object if successful, otherwise undefined.
 */
export const costRequest = async (
    id: string,
    dependency: boolean,
    errorSetter: (error: string) => void
): Promise<PackageCost | undefined> => {
    try {
        const response = await fetch(
            `${GeneralConfig.BACKEND_URL}package/${id}/cost?dependency=${dependency}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${localStorage.getItem('token')}`,
                },
            }
        );

        if (!response.ok) {
            const responseText = await response.text();
            errorSetter(responseText);
            return undefined;
        }

        const costData: PackageCost = await response.json();
        return costData;
    } catch (err) {
        if (err instanceof Error) {
            errorSetter(err.message);
        } else {
            errorSetter('An unknown error occurred in costRequest.');
        }
    }
};
