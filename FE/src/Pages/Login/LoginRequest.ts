import { GeneralConfig } from '../../Config/config';

export const authenticateUserRequest = async (username: string, password: string): Promise<string> => {
    let responseText: string = '';
    try {
        const response = await fetch(`${GeneralConfig.BACKEND_URL}authenticate`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                User: {
                    name: username,
                    isAdmin: true,
                },
                Secret: {
                    password: password,
                },
            }),
        });
        responseText = await response.text();
    } catch (err) {
        if (err instanceof Error) {
            responseText = err.message;
        } else {
            responseText = 'An unknown error occured';
        }
    }
    return responseText;
};
