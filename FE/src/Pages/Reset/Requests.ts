import { GeneralConfig } from '../../Config/config';

export const resetRegistryRequest = async (
    errorSetter: (error: string) => void,
    successSetter: (successMessage: string) => void
): Promise<void> => {
    try {
        const response = await fetch(`${GeneralConfig.BACKEND_URL}reset`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${localStorage.getItem('token')}`,
            },
        });
        if (!response.ok) {
            const responseText = await response.text();
            errorSetter(responseText);
            return undefined;
        } else if (response.ok) {
            const responseText = await response.text();
            successSetter(responseText);
        }
    } catch (err) {
        if (err instanceof Error) {
            errorSetter(err.message);
        } else errorSetter('an unknown error occured in getPackagesViaRegexRequest');
    }
};
