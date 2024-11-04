import axios from "axios";
import { LogDebug } from "../Providers/Utils/Log";
import { GenerateManagementToken } from "../Middleware/ManagementToken";

const DEFAULT_USER_UID = "abc"; // will replace with the default user's uid

export async function GetAllUserIDs() {
    const token = await GenerateManagementToken();

    const response = await axios.get(`https://YOUR_AUTH0_DOMAIN/api/v2/users`, {
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

async function DeleteAllUsers(deleteDefaultUser: boolean = false, confirmFullDelete: boolean = false) {
    const token = await GenerateManagementToken();

    // Retrieve all user IDs
    const userIDs = await GetAllUserIDs();

    // Delete each user individually
    for (const uid of userIDs) {
        if (uid === DEFAULT_USER_UID) {
            if (deleteDefaultUser == false || confirmFullDelete == false) {
                continue;
            }
        }
        try {
            await axios.delete(`https://YOUR_AUTH0_DOMAIN/api/v2/users/${uid}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            LogDebug(`Deleted user: ${uid}`);
        } catch (error) {
            console.error(`Failed to delete user: ${uid}`, error);
        }
    }
}

export async function ResetSystem() {
    await DeleteAllUsers();
}
