import { GeneralConfig } from '../../Config/config';

export const uploadFile = async (
    debloat: boolean,
    errorSetter: (error: string) => void,
    successSetter: (successMessage: string) => void,
    JSProgram: string,
    base64?: string,
    url?: string
) => {
    try {
        const response = await fetch(`${GeneralConfig.BACKEND_URL}package`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
                ...(base64 && { Content: base64 }),
                ...(url && { URL: url }),
                debloat,
                JSProgram,
            }),
        });

        if (!response.ok) {
            const responseText = await response.text();
            errorSetter(responseText);
        } else if (response.ok) {
            const data = await response.json();
            if (data.metadata.ID) {
                successSetter(`ID: ${data.metadata.ID}`);
            }
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
