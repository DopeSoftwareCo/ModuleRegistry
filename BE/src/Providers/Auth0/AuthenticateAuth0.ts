import { AuthenticationRequestBody } from "RequestTypes";

export const authenticateViaAuth0 = async (
    body: AuthenticationRequestBody
): Promise<{ invalidUserPass: boolean; token: string | undefined }> => {
    try {
        if (
            !process.env.AUTH0_CLIENT_ID ||
            !process.env.AUTH0_CLIENT_SECRET ||
            !process.env.AUTH0_AUDIENCE ||
            !process.env.AUTH0_DOMAIN
        ) {
            throw new Error("env variables are missing");
        }

        console.log(
            process.env.AUTH0_CLIENT_ID,
            process.env.AUTH0_CLIENT_SECRET,
            process.env.AUTH0_AUDIENCE,
            process.env.AUTH0_DOMAIN
        );
        const response = await fetch(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                grant_type: "password",
                username: body.User.name,
                password: body.Secret.password,
                client_id: process.env.AUTH0_CLIENT_ID,
                client_secret: process.env.AUTH0_CLIENT_SECRET,
                audience: process.env.AUTH0_AUDIENCE,
                connection: "Username-Password-Authentication",
            }),
        });
        const json = await response.json();
        return { invalidUserPass: json.error || json.error_description, token: json.access_token };
    } catch (err) {
        if (err instanceof Error) {
            console.log(`Authentication error: `, err.message);
        } else console.log(`Authentication error of unknown type.`);
        return { invalidUserPass: true, token: undefined };
    }
};
