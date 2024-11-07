import { Auth0_Database, RegistrationInfo, RequestForUserChanges } from "../../Providers/Auth0/Auth0_DB";
import { Permission, Role } from "../Users/subdir.const";
import { RestrictedOp } from "./RestrictedOp";

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
