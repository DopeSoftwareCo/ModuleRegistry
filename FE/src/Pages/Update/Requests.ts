import { GeneralConfig } from '../../Config/config';

export const updateWithPackage = async (
    debloat: boolean,
    errorSetter: (error: string) => void,
    successSetter: (successMessage: string) => void,
    name?: string,
    version?: string,
    id?: string,
    JSProgram?: string,
    base64?: string,
    url?: string
) => {
    try {
        const response = await fetch(`${GeneralConfig.BACKEND_URL}package/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
                metadata: {
                    Name: name ? name : 'no name',
                    Version: version ? version : 'no version',
                    ID: id ? id : 'no id',
                },
                data: {
                    ...(base64 && { Content: base64 }),
                    ...(url && { URL: url }),
                    debloat,
                    JSProgram: JSProgram ? JSProgram : 'no program',
                },
            }),
        });

        if (!response.ok) {
            const responseText = await response.text();
            errorSetter(responseText);
        } else if (response.ok) {
            const data = await response.text();
            successSetter(data);
        }
    } catch (err) {
        if (err instanceof Error) {
            errorSetter(err.message);
        } else errorSetter('Some unknown error occured in uploadFile.');
    }
};
