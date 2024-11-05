import axios from "axios";
import { GenerateManagementToken } from "../../Middleware/ManagementToken";
import { Auth0_Database, RegistrationInfo, RequestForUserChanges } from "../../Providers/Auth0/Auth0_DB";
import { Permission, Role } from "../Users/subdir.const";
import { RestrictedOp } from "./RestrictedOp";
import { GetAllUserIDs } from "../../Services/ResetSystem";
import { LogDebug } from "../../Providers/Utils/Log";

// ==================== INSERT =====================
const EMPTY_REGISTRATION: RegistrationInfo = {
    email: "",
    password: "",
    permission: 0,
    role: 0,
    username: "",
};

// Not exported
async function RestrictWrapped_INSERT(args: any[]): Promise<string | undefined> {
    const info: RegistrationInfo = args[0];
    return await Auth0_Database.INSERT(info);
}

export const Restricted_INSERT = new RestrictedOp<string | undefined>(
    [EMPTY_REGISTRATION],
    RestrictWrapped_INSERT,
    [Permission._111],
    [Role.Admin]
);

// ==================== UPDATE =====================
const EMPTY_CHANGEREQ: RequestForUserChanges = {
    username: "",
    password: "",
    role: 0,
    permission: 0,
};

// Not exported
async function RestrictWrapped_UPDATE(args: any[]): Promise<boolean | undefined> {
    const uid: string = args[0];
    const changes: RequestForUserChanges = args[1];
    return await Auth0_Database.UPDATE(uid, changes);
}

export const Restricted_UPDATE = new RestrictedOp<boolean | undefined>(
    ["uid", EMPTY_CHANGEREQ],
    RestrictWrapped_UPDATE,
    [Permission._111],
    [Role.Admin]
);

// ==================== SYSRESET =====================
const DEFAULT_UID = "abc";

// Not exported
async function DeleteAllUsers(deleteDefaultUser: boolean = false, confirmFullDelete: boolean = false) {
    const token = await GenerateManagementToken();

    // Retrieve all user IDs
    const userIDs = await GetAllUserIDs();

    // Delete each user individually
    for (const uid of userIDs) {
        if (uid === DEFAULT_UID) {
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

async function RestrictWrapped_ResetSystem(args: any[]) {
    DeleteAllUsers();
}

export const Restricted_ResetSystem = new RestrictedOp<void>(
    [],
    RestrictWrapped_ResetSystem,
    [Permission._111],
    [Role.Admin]
);
