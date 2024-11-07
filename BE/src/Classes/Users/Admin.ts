import { User } from "./User";
import { Auth0_Database, RegistrationInfo } from "../../Providers/Auth0/Auth0_DB";
import { Permission, Role } from "./subdir.const";

export class Admin extends User {
    constructor(uid: string, email: string, username: string) {
        super(uid, email, Permission._111, Role.Admin, username);
    }

    async DeleteOtherUser(uid: string): Promise<boolean> {
        return await Auth0_Database.DELETE(uid);
    }

    async Register_User(
        email: string,
        password: string,
        permission: Permission,
        role: Role,
        username: string
    ): Promise<User | undefined> {
        const info: RegistrationInfo = {
            email: email,
            password: password,
            permission: permission,
            role: role,
            username: username,
        };
        const uid = await Auth0_Database.INSERT(info);
        return uid ? new User(uid, email, permission, role, username) : undefined;
    }

    async Register_Admin(email: string, password: string, username: string): Promise<Admin | undefined> {
        const info: RegistrationInfo = {
            email: email,
            password: password,
            permission: Permission._111,
            role: Role.Admin,
            username: username, // Optional: Only if needed
        };

        const uid = await Auth0_Database.INSERT(info);
        return uid ? new Admin(uid, email, username) : undefined;
    }
}
