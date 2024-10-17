import { GeneralConfig } from '../../Config/config';

export const authenticateUserRequest = async (username: string, password: string): Promise<string> => {
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
    const responseText = await response.text();
    return responseText;
};
