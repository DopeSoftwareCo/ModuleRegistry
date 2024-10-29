import { GeneralConfig } from '../../Config/config';

export const uploadFile = async (base64: string, debloat: boolean, errorSetter: (error: string) => void) => {
    try {
        const response = await fetch(`${GeneralConfig.BACKEND_URL}package/byRegEx`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ Content: base64, debloat, JSProgram: '' }),
        });

        if (!response.ok) {
            const responseText = await response.text();
            errorSetter(responseText);
            return undefined;
        }
    } catch (err) {
        if (err instanceof Error) {
            errorSetter(err.message);
        } else errorSetter('Some unknown error occured in uploadFile.');
    }
};

/**
 * 
 * 
 * export const getPackagesViaRegexRequest = async (
    regex: string,
    errorSetter: (error: string) => void
): Promise<RegexPackagesFromAPI | undefined> => {
    try {
        const response = await fetch(`${GeneralConfig.BACKEND_URL}package/byRegEx`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ RegEx: regex }),
        });
        if (!response.ok) {
            const responseText = await response.text();
            errorSetter(responseText);
            return undefined;
        }
        const regexPackages: RegexPackagesFromAPI = await response.json();
        return regexPackages;
    } catch (err) {
        if (err instanceof Error) {
            errorSetter(err.message);
        } else errorSetter('an unknown error occured in getPackagesViaRegexRequest');
    }
};
 */
