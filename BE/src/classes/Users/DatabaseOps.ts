import dotenv from "dotenv";
dotenv.config();

import axios from "axios";
import { LogDebug } from "../../Providers/Utils/Log";
import { UDS } from "./UDS_Permissions/subdir.const";
import { getManagementToken } from "../../Providers/Auth0/ManagementToken";
import { UDSToString } from "./UDS_Permissions/subdir.utils";

const auth0Domain = process.env.AUTH0_DOMAIN;
const managementToken = process.env.AUTH0_MANAGEMENT_TOKEN;

export interface RegistrationInfo {
    email: string;
    password: string;
    permission: string;
    roleString: string | null;
    connection: string; // Auth0 connection name, like 'Username-Password-Authentication'
    username?: string; // Optional: Only if needed
}

interface Auth0User {
    user_id: string;
    name: string;
    email: string;
    permissions: string;
    username?: string;
    created_at?: string;
    last_login?: string;
    logins_count?: number;
    // Add any other fields you may need
}

export namespace Auth0_Database {
    export async function INSERT(info: RegistrationInfo): Promise<string | undefined> {
        if (!managementToken || !auth0Domain) {
            console.error("Auth0 domain or token is missing in the environment variables.");
            return undefined;
        }

        try {
            const response = await axios.post(
                `https://${auth0Domain}/api/v2/users`,
                {
                    email: info.email,
                    password: info.password,
                    permissions: info.permission,
                    role: info.roleString,
                    connection: info.connection,
                    username: info.username, // Optional
                },
                {
                    headers: {
                        Authorization: `Bearer ${managementToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            return response.data.user_id;
        } catch (error) {
            LogDebug("Failed to add user:");
            return undefined;
        }
    }

    export async function DELETE(uid: string): Promise<boolean> {
        if (!managementToken || !auth0Domain) {
            console.error("Auth0 domain or token is missing in the environment variables.");
            return false;
        }

        try {
            await axios.delete(`https://${auth0Domain}/api/v2/users/${uid}`, {
                headers: {
                    Authorization: `Bearer ${managementToken}`,
                },
            });
            return true;
        } catch (error) {
            LogDebug(`Failed to delete user with ID ${uid}:`);
            return false;
        }
    }

    export async function UPDATE(uid: string, permissions: string[]): Promise<boolean> {
        if (!managementToken || !auth0Domain) {
            console.error("Auth0 domain or token is missing in the environment variables.");
            return false;
        }

        try {
            const permissionPayload = permissions.map((permission) => ({
                permission_name: permission,
                resource_server_identifier: process.env.AUTH0_AUDIENCE,
            }));

            await axios.post(
                `https://${auth0Domain}/api/v2/users/${uid}/permissions`,
                { permissions: permissionPayload },
                {
                    headers: {
                        Authorization: `Bearer ${managementToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            return true;
        } catch (error) {
            LogDebug("Failed to update permissions:");
            return false;
        }
    }

    export async function LOAD(uid: string): Promise<Auth0User | null> {
        // e.g., 'your-domain.auth0.com'

        try {
            const response = await axios.get<Auth0User>(`https://${auth0Domain}/api/v2/users/${uid}`, {
                headers: {
                    Authorization: `Bearer ${managementToken}`,
                },
            });
            return response.data;
        } catch (error) {
            LogDebug("Error fetching user info from Auth0:");
            return null;
        }
    }
}

export namespace Mongo_Database {}
