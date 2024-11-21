import axios from "axios";
import dotenv from "dotenv";
import { LogDebug } from "../Utils/Log";

dotenv.config();
const auth0Domain = process.env.AUTH0_DOMAIN;
const audience = process.env.MANAGEMENT_API_TOKEN_REQUEST_AUDIENCE;

export async function getManagementToken(): Promise<string | null> {
    try {
        const response = await axios.post(`https://${auth0Domain}/oauth/token`, {
            client_id: process.env.API_CLIENT_ID,
            client_secret: process.env.API_CLIENT_SECRET,
            audience: audience,
            grant_type: "client_credentials",
        });
        return response.data.access_token;
    } catch (error) {
        LogDebug("Failed to get Management API token:");
        console.log(error);
        return null;
    }
}
