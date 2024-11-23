import dotenv from "dotenv";
dotenv.config();

import axios from "axios";
import { LogDebug } from "../../Utils/Log";
import { token } from "../../Middleware/ManagementToken";
import { essential_attributes } from "./UserData";
import { Auth0User, EssentialUserData, RegistrationInfo, UserUpdates, UserAttribute } from "./types";
import { DEFAULT_USERNAME } from "./UserData";
import { UpdateUserRequestBody } from "RequestTypes";
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
            return response.data.user_id;
        } catch (error) {
            LogDebug(`Failed to add user: ${error}`);
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

    export async function UPDATE(request: UpdateUserRequestBody): Promise<boolean> {
        if (!token) {
            throw new Error("Management token is not available");
        }

        try {
            const updateData: UserUpdates = { user_metadata: {} };
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

            await axios.patch(`https://${auth0Domain}/api/v2/users/${request.id}`, updateData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            return true;
        } catch (error) {
            LogDebug(`Error updating user: ${error}`);
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
            LogDebug(`Error fetching user info from Auth0:${error}`);
            return null;
        }
    }

    export async function SELECT_STAR_FROM_ESSENTIAL(): Promise<EssentialUserData[] | undefined> {
        try {
            const response = await axios.get<Auth0User[]>(`https://${auth0Domain}/api/v2/users`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    fields: essential_attributes,
                    include_fields: true,
                    per_page: 100, // Adjust this to fetch more or less per request,
                },
            });

            if (!response) {
                return undefined;
            }
            return response.data;
        } catch (error) {
            LogDebug(`Failed SELECT * FROM ESSENTIAL: ${error}`);
        }
    }

    const rateLimitEnforcer = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    export async function RESET(): Promise<boolean> {
        const users = await Auth0_Database.SELECT_STAR_FROM_ESSENTIAL();

        if (!users) {
            return false;
        }

        const deletable = users.filter((user) => user.username !== DEFAULT_USERNAME);
        const size = deletable.length;

        let removals = 0;

        for (const user of deletable) {
            const id = user.user_id;

            try {
                await DELETE(id);
                LogDebug(`Deleted user: ${id}`);
                removals++;
            } catch (error) {
                console.error(`Failed to delete user: ${id}`, error);
            }

            // Enforce the rate limit delay
            await rateLimitEnforcer(2000);
        }

        return removals === size;
    }
}
