import { Auth0_Database } from "../../Providers/Auth0/Auth0_DB";
import { UDS } from "./subdir.const";
import { PermissionStringToUDS } from "./subdir.utils";
import { Role } from "./subdir.const";

export class User {
    protected readonly uid: string;
    protected readonly email: string;
    protected username: string;
    protected UDS: UDS;
    protected role: Role;

    constructor(
        uid: string,
        email: string,
        permissions: string,
        role: Role = Role.Unknown,
        username: string
    ) {
        this.uid = uid;
        this.email = email;
        this.UDS = PermissionStringToUDS(permissions);
        this.role = role;
        this.username = username;
    }

    async SelfDelete(): Promise<boolean> {
        return await Auth0_Database.DELETE(this.uid);
    }

    Upload(item: any): boolean {
        // Block operation if user lacks upload permission
        if (!this.UDS.U) {
            return false;
        }

        // Ben's content here
        return true;
    }

    Downlod(packageID: string): boolean {
        // Block operation if user lacks upload permission
        if (!this.UDS.D) {
            return false;
        }

        // functionality goes here
        return true;
    }

    Search(request: string): boolean {
        // Block operation if user lacks upload permission
        if (!this.UDS.S) {
            return false;
        }

        // functionality goes here
        return true;
    }

    get Permissions(): UDS {
        return this.UDS;
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
