import axios from "axios";
import dotenv from "dotenv";
import { LogDebug } from "../Utils/Log";

dotenv.config();

export async function getManagementToken(): Promise<string | null> {
    try {
        const response = await axios.post(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
            client_id: process.env.AUTH0_CLIENT_ID,
            client_secret: process.env.AUTH0_CLIENT_SECRET,
            audience: process.env.AUTH0_AUDIENCE,
            grant_type: "client_credentials",
        });
        return response.data.access_token;
    } catch (error) {
        LogDebug("Failed to get Management API token:");
        return null;
    }
}
