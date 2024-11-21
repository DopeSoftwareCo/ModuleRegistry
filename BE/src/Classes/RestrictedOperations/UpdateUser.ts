import { Auth0_Database, RequestForUserChanges } from "../../Providers/Auth0/Auth0_DB";
import { PermissionEnum, Role } from "../Users/subdir.const";
import { RestrictedOp } from "./RestrictedOp";

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
    [PermissionEnum._111],
    [Role.Admin]
);
