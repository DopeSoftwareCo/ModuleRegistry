import { User } from "./User";
import { Auth0_Database, RegistrationInfo } from "./DatabaseOps";
import { ADMIN_ROLE } from "./Roles/subdir.const";
import { Role } from "./Roles/subdir.const";

export class Admin extends User {
    constructor(uid: string, email: string, username: string | undefined) {
        super(uid, email, "111", ADMIN_ROLE, username);
    }

    async DeleteOtherUser(uid: string): Promise<boolean> {
        return await Auth0_Database.DELETE(uid);
    }

    async Register_User(
        email: string,
        password: string,
        permission: string,
        role: Role,
        username?: string
    ): Promise<User | undefined> {
        const info: RegistrationInfo = {
            email: email,
            password: password,
            permission: permission,
            roleString: role.stringFormat,
            connection: "",
            username: username,
        };
        const uid = await Auth0_Database.INSERT(info);
        return uid ? new User(uid, email, permission, role, username) : undefined;
    }

    async Register_Admin(email: string, password: string, username?: string): Promise<Admin | undefined> {
        const info: RegistrationInfo = {
            email: email,
            password: password,
            permission: "111",
            roleString: ADMIN_ROLE.stringFormat,
            connection: "", // Auth0 connection name, like 'Username-Password-Authentication'
            username: username, // Optional: Only if needed
        };

        const uid = await Auth0_Database.INSERT(info);
        return uid ? new Admin(uid, email, username) : undefined;
    }
}
