import { Auth0_Database } from "../../Providers/Auth0/Auth0_DB";
import { Permission, UDS } from "./subdir.const";
import { ToUDS, ToPermissionNumber } from "./subdir.utils";
import { Role } from "./subdir.const";

export class User {
    protected readonly uid: string;
    protected readonly email: string;
    protected username: string;
    protected uds: UDS;
    protected role: Role;

    constructor(
        uid: string,
        email: string,
        permissions: Permission, // This is an enum value
        role: Role = Role.Unknown, // This is also an enum value
        username: string
    ) {
        this.uid = uid;
        this.email = email;
        this.uds = ToUDS(permissions);
        this.role = role;
        this.username = username;
    }

    async SelfDelete(): Promise<boolean> {
        return await Auth0_Database.DELETE(this.uid);
    }

    Upload(item: any): boolean {
        // Block operation if user lacks upload permission
        if (!this.uds.U) {
            return false;
        }

        // Ben's content here
        return true;
    }

    Downlod(packageID: string): boolean {
        // Block operation if user lacks upload permission
        if (!this.uds.D) {
            return false;
        }

        // functionality goes here
        return true;
    }

    Search(request: string): boolean {
        // Block operation if user lacks upload permission
        if (!this.uds.S) {
            return false;
        }

        // functionality goes here
        return true;
    }

    get UDS(): UDS {
        return this.uds;
    }

    get Numeric_Permission(): Permission {
        return ToPermissionNumber(this.uds);
    }

    get Role(): Role {
        return this.role;
    }

    get Email(): string {
        return this.email;
    }
    get UID(): string {
        return this.uid;
    }

    get Username(): string {
        return this.username;
    }
}
