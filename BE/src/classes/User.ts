import { MakePositiveInteger } from "../DSinc_Modules/DSinc_Math";

export class User {
    UID: string;
    username: string;
    permission: USD_Permission;

    constructor(username: string, permissions: USD_Permission) {
        this.UID = "xxxx-xx"; // Will be generated
        this.username = username;
        this.permission = permissions;
    }
}

class USD_Permission {
    uploadPermission: number;
    searchPermission: number;
    deletePermission: number;

    constructor(u: number, s: number, d: number) {
        this.uploadPermission = MakePositiveInteger(u);
        this.searchPermission = MakePositiveInteger(s);
        this.deletePermission = MakePositiveInteger(d);
    }

    get U(): number {
        return this.uploadPermission;
    }
    get S(): number {
        return this.searchPermission;
    }
    get D(): number {
        return this.deletePermission;
    }
}
