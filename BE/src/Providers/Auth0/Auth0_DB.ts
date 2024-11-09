import dotenv from "dotenv";
dotenv.config();

import axios from "axios";
import { LogDebug } from "../Utils/Log";
import { token } from "../../Middleware/ManagementToken";
import { Auth0User, RegistrationInfo, RequestForUserChanges, UpdateUserRequest } from "./Auth0_DB.types";

const auth0Domain = process.env.AUTH0_DOMAIN;

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
                        role: info.role,
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

    export async function UPDATE(request: RequestForUserChanges): Promise<boolean> {
        if (!token) {
            throw new Error("Management token is not available");
        }

        try {
            const updateData: UpdateUserRequest = { user_metadata: {} };
            let changeCount = 0;
            // Only include properties that have been provided
            if (request.username) {
                updateData.username = request.username;
                ++changeCount;
            }
            if (request.password) {
                updateData.password = request.password;
                ++changeCount;
            }
            if (request.permission) {
                updateData.user_metadata.permission = request.permission;
                ++changeCount;
            }
            if (request.role) {
                updateData.user_metadata.role = request.role;
                ++changeCount;
            }

            // Im not wasting everyone's time to send your request to the API unless
            // you have requested AT LEAST 1 change
            if (changeCount < 1) {
                LogDebug("No changes to make!");
                return false;
            }

            await axios.patch(`https://${auth0Domain}/api/v2/users/${request.uid}`, updateData, {
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

    export async function LOAD(uid: string): Promise<Auth0User | null> {
        try {
            const response = await axios.get<Auth0User>(`https://${auth0Domain}/api/v2/users/${uid}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return response.data;
        } catch (error) {
            LogDebug("Error fetching user info from Auth0:");
            console.log(error);
            return null;
        }
    }
    export async function SELECT_UID() {
        const response = await axios.get(`https://${auth0Domain}/api/v2/users`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                fields: "user_id",
                include_fields: true,
                per_page: 100, // Adjust this to fetch more or less per request
            },
        });

        const userIDs = response.data.map((user: { user_id: string }) => user.user_id);
        return userIDs;
    }
}
