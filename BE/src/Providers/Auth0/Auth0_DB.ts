import dotenv from "dotenv";
dotenv.config();

import axios from "axios";
import { LogDebug } from "../Utils/Log";
import { User } from "../../Classes/Users/User";
import { token } from "../../Middleware/ManagementToken";

const auth0Domain = process.env.AUTH0_DOMAIN;

export interface RegistrationInfo {
    email: string;
    password: string;
    permission: string;
    roleNum: number; // Auth0 connection name, like 'Username-Password-Authentication'
    username: string; // Optional: Only if needed
}

export interface RequestForUserChanges {
    username?: string;
    password?: string;
    permission?: string;
    role?: number;
}

interface Auth0User {
    user_id: string;
    name: string;
    email: string;
    username: string;
    user_metadata: {
        permission: string;
        role: number;
    };
    //permissions: string[];
    created_at?: string;
    last_login?: string;
    logins_count?: number;
    // Add any other fields you may need
}

interface UserBeingUpdated {
    user_id?: string;
    name?: string;
    email?: string;
    username?: string;
    user_metadata: {
        permission?: string;
        role?: number;
    };
    password?: string;
}

export namespace Auth0_Database {
    export async function INSERT(info: RegistrationInfo): Promise<string | undefined> {
        if (!token || !auth0Domain) {
            console.error("Auth0 domain or token is missing in the environment variables.");
            return undefined;
        }

        try {
            const response = await axios.post(
                `https://${auth0Domain}/api/v2/users`,
                {
                    email: info.email,
                    password: info.password,
                    connection: "Username-Password-Authentication",
                    user_metadata: {
                        permission: info.permission,
                        role: info.roleNum,
                    },
                    //permissions: info.permission,
                    username: info.username, // Optional
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log(response.data);
            return response.data.user_id;
        } catch (error) {
            console.log(error);
            LogDebug("Failed to add user:");
            return undefined;
        }
    }

    export async function DELETE(uid: string): Promise<boolean> {
        if (!token || !auth0Domain) {
            console.error("Auth0 domain or token is missing in the environment variables.");
            return false;
        }

        try {
            await axios.delete(`https://${auth0Domain}/api/v2/users/${uid}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return true;
        } catch (error) {
            LogDebug(`Failed to delete user with ID ${uid}:`);
            return false;
        }
    }

    export async function UPDATE(uid: string, changes: RequestForUserChanges): Promise<boolean> {
        if (!token) {
            throw new Error("Management token is not available");
        }

        try {
            const updateData: UserBeingUpdated = { user_metadata: {} };
            let changeCount = 0;
            // Only include properties that have been provided
            if (changes.username) {
                updateData.username = changes.username;
                ++changeCount;
            }
            if (changes.password) {
                updateData.password = changes.password;
                ++changeCount;
            }
            if (changes.permission) {
                updateData.user_metadata.permission = changes.permission;
                ++changeCount;
            }
            if (changes.role) {
                updateData.user_metadata.role = changes.role;
                ++changeCount;
            }

            // Im not wasting everyone's time to send your request to the API unless
            // you have requested AT LEAST 1 change
            if (changeCount < 1) {
                LogDebug("No changes to make!");
                return false;
            }

            await axios.patch(`https://${auth0Domain}/api/v2/users/${uid}`, updateData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            return true;
        } catch (error) {
            LogDebug("Error updating user:");
            console.log(error);
            return false;
        }
    }

    export async function LOAD(uid: string): Promise<User | null> {
        try {
            const response = await axios.get<Auth0User>(`https://${auth0Domain}/api/v2/users/${uid}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = response.data;
            console.log(data);
            const user = new User(
                data.user_id,
                data.email,
                data.user_metadata.permission,
                data.user_metadata.role,
                data.username
            );
            return user;
        } catch (error) {
            LogDebug("Error fetching user info from Auth0:");
            console.log(error);
            return null;
        }
    }
}
