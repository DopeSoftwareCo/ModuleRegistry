import { AuthenticationError } from "openai/error";
import { MakePositiveInteger } from "../DSinc_Modules/DSinc_Math";
import { Package } from "../Types/Models";
import { AccessPermit } from "./Permissions";

export class User {
    uid: string;
    username: string;
    permit: AccessPermit;

    constructor(uid: string, username: string, permissions: string) {
        this.uid = uid; // Will be generated
        this.username = username;
        this.permission = permissions;
    }

    SelfDelete() {
        return RemoveFromDB(this.uid);
    }
}

export class Admin extends User {
    userBuilder: User_Builder;

    constructor(uid: string, username: string, permissions: string) {
        super(uid, username, permissions);
        this.userBuilder = new User_Builder();
    }

    DeleteOtherUser(uid: string) {}

    RegisterNew(
        email: string,
        permission: AccessPermit,
        isAdmin: boolean
    ): { user?: User; success: boolean } {
        const user = this.userBuilder.Build_User(email, permission);
        AddToDB(user);
        return user;
    }

    MakeAdmin(uid: string) {}
}

class User_Builder {
    constructor() {}
    Build_User(email: string, password: string, permission: string): User | null {
        // Programmatically put a new user in auth0
        const uid = "";

        const user = new User(uid, email, permission);
        return user;
    }

    Build_Admin(): Admin | null {
        // Programmatically put a new admin in auth0
        return null;
    }
}
