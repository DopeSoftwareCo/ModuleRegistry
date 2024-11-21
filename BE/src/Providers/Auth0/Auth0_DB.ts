import dotenv from "dotenv";
dotenv.config();

import axios from "axios";
import { LogDebug } from "../Utils/Log";
import { token } from "../../Middleware/ManagementToken";
import {
    Auth0User,
    RegistrationInfo,
    UpdateUserRequest_DevFriendly,
    UpdateUserRequest,
    IndexableAuth0User,
} from "./Auth0_DB.types";
import { DEFAULT_USERNAME } from "./UserData";

const auth0Domain = process.env.AUTH0_DOMAIN;

export type UserAttribute =
    | "user_id"
    | "name"
    | "email"
    | "username"
    | "user_metadata"
    | "user_metadata: { permission }"
    | "user_metadata: { role }"
    | "created_at"
    | "last_login"
    | "logins_count";

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

    export async function UPDATE(request: UpdateUserRequest_DevFriendly): Promise<boolean> {
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

    export async function SELECT(attributes?: UserAttribute[]): Promise<Record<string, any>[] | undefined> {
        if (!token || !auth0Domain) {
            console.error("Auth0 domain or token is missing in the environment variables.");
            return undefined;
        }

        try {
            const allUsers: Record<string, any>[] = [];
            let page = 0;
            let moreUsers = true;

            while (moreUsers) {
                const response = await axios.get<IndexableAuth0User[]>(
                    `https://${auth0Domain}/api/v2/users`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        params: {
                            fields: attributes ? attributes.join() : "user_id",
                            include_fields: true,
                            page,
                            per_page: 100,
                        },
                    }
                );

                const users = response.data;

                if (users.length > 0) {
                    // Map and filter users based on requested attributes
                    users.forEach((user) => {
                        const filteredUser: Record<string, any> = {};
                        if (attributes) {
                            for (const attribute of attributes) {
                                filteredUser[attribute] = user[attribute];
                            }
                        } else {
                            filteredUser["user_id"] = user.user_id; // Default case
                        }
                        allUsers.push(filteredUser);
                    });
                    page++;
                } else {
                    moreUsers = false;
                }
            }

            return allUsers;
        } catch (error) {
            console.error("Error fetching users from Auth0:", error);
            return undefined;
        }
    }

    export async function RESET(): Promise<boolean> {
        try {
            // Fetch all users with `username` and `user_id`
            const users = await SELECT(["username", "user_id"]);
            if (!users) {
                console.error("Failed to fetch users from Auth0.");
                return false;
            }

            // Filter users to exclude "defaultUser" and "admin_user"
            const usersToDelete = users.filter(
                (user) => user.username !== "defaultUser" && user.username !== DEFAULT_USERNAME
            );

            if (usersToDelete.length === 0) {
                console.log("No users to delete.");
                return true;
            }

            // Use the DELETE function for each user
            const deletionResults = await Promise.all(usersToDelete.map((user) => DELETE(user.user_id)));

            // Check if all deletions were successful
            const allSuccessful = deletionResults.every((result) => result === true);
            if (!allSuccessful) {
                console.error("One or more deletions failed.");
            }

            return allSuccessful;
        } catch (error) {
            console.error("An error occurred while attempting to reset user db:", error);
            return false;
        }
    }
}
