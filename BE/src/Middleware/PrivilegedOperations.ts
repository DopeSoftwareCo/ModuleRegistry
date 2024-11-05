import { Role, UDS } from "../Classes/Users/subdir.const";
import * as jsonwebtoken from "jsonwebtoken";
import { Permission } from "../Classes/Users/subdir.const";

const AllRoles = [0, 1, 2, 3];
const UNRESTRICTED_BY_ROLE: RoleRestriction = [true, true, true, true];
export const ALL_PERMISSIONS = [0, 1, 2, 3, 4, 5, 6, 7];

export type RoleRestriction = [boolean, boolean, boolean, boolean];

export class RestrictedOperation {
    roleRestriction: RoleRestriction;
    permissionsAllowed: Permission[];
    limitedByRole: boolean = false;

    constructor(permissionRequirement: Permission[], roleRestriction?: RoleRestriction) {
        if (!roleRestriction) {
            this.roleRestriction = UNRESTRICTED_BY_ROLE;
        } else {
            this.roleRestriction = roleRestriction;
            this.limitedByRole = true;
        }

        this.permissionsAllowed = permissionRequirement.length > 0 ? permissionRequirement : ALL_PERMISSIONS;
    }

    VerifyPermission(permission: Permission): boolean {
        return this.permissionsAllowed.includes(permission);
    }

    VerifyRole(role: Role): boolean {
        return this.limitedByRole ? this.roleRestriction[role] : true;
    }

    Execute(decodedToken: jsonwebtoken.TokenType): boolean | undefined {
        const permission = decodedToken.metadata.permission;
        const role = decodedToken.metadata.role;

        const proceed: boolean = this.VerifyPermission(permission) && this.VerifyRole(role);

        return proceed;
    }
}
