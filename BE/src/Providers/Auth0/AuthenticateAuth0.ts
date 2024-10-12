import { AuthenticationRequestBody } from "RequestTypes";

export const authenticateViaAuth0 = (req: AuthenticationRequestBody) => {
    try {
        const response = await fetch(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                grant_type: "password",
                username: req.body.user,
                password: password,
                client_id: process.env.AUTH0_CLIENT_ID,
                client_secret: process.env.AUTH0_CLIENT_SECRET, // Needed for confidential clients
                audience: process.env.AUTH0_AUDIENCE, // API audience/identifier
                scope: "openid profile email", // Adjust the scope as necessary
            }),
        });
    } catch (err) {
        if (err instanceof Error) {
            console.log(`Authentication error: `, err.message);
        } else console.log(`Authentication error of unknown type.`);
    }
};
