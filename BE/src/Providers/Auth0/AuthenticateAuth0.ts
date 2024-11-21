import { AuthenticationRequestBody } from "RequestTypes";

export const swapDefaultPass = (pass: string) => {
    if (pass.includes("DROP TABLE")) {
        return Buffer.from(pass).toString("base64");
    }
    return pass;
};

/**
 * @author John Leidy
 * @description Makes a request to auth0 to retrieve a token.
 * @param body {@type AuthenticationRequestBody} the request body containing username, isAdmin, password
 * @returns Auth information {@type {invalidUserPass: boolean, token: string|undefined}}
 */
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
        const pass = swapDefaultPass(body.Secret.password.replace(/\\/g, ""));
        const response = await fetch(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                grant_type: "password",
                username: body.User.name,
                password: pass,
                client_id: process.env.AUTH0_CLIENT_ID,
                client_secret: process.env.AUTH0_CLIENT_SECRET,
                audience: process.env.AUTH0_AUDIENCE,
                connection: "Username-Password-Authentication",
            }),
        });
        const json = await response.json();
        return {
            invalidUserPass: json.error || json.error_description,
            token: `Bearer ${json.access_token}`,
        };
    } catch (err) {
        if (err instanceof Error) {
            console.log(`Authentication error: `, err.message);
        } else console.log(`Authentication error of unknown type.`);
        return { invalidUserPass: true, token: undefined };
    }
};
