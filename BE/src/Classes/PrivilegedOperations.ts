import { Role, UDS } from "./Users/subdir.const";
import * as jsonwebtoken from "jsonwebtoken";
import { PermissionEnum } from "./Users/subdir.const";

const ALL_ROLES: Role[] = [0, 1, 2, 3];
export const ALL_PERMISSIONS: PermissionEnum[] = [0, 1, 2, 3, 4, 5, 6, 7];

export class RestrictedOperation {
    roleRestriction: Role[];
    permissionsAllowed: PermissionEnum[];
    limitedByRole: boolean = false;

    constructor(permissionRequirement: PermissionEnum[], roleRestriction?: Role[]) {
        if (!roleRestriction) {
            this.roleRestriction = ALL_ROLES;
        } else {
            this.roleRestriction = roleRestriction;
            this.limitedByRole = true;
        }

        this.permissionsAllowed = permissionRequirement.length > 0 ? permissionRequirement : ALL_PERMISSIONS;
    }

    VerifyPermission(permission: PermissionEnum): boolean {
        return this.permissionsAllowed.includes(permission);
    }

    VerifyRole(role: Role): boolean {
        return this.limitedByRole ? this.roleRestriction.includes(role) : true;
    }

    Execute(decodedToken: jsonwebtoken.TokenType): boolean | undefined {
        const permission = decodedToken.metadata.permission;
        const role = decodedToken.metadata.role;
        const proceed: boolean = this.VerifyPermission(permission) && this.VerifyRole(role);

        return proceed;
    }
}

export class Mock_RestrictedOperation<Input, Output> {
    op: (input: Input) => Output;
    roleRestriction: Role[];
    permissionsAllowed: PermissionEnum[];
    limitedByRole: boolean = false;
    voidInput = false;

    constructor(
        operation: (input: Input) => Output,
        permissionRequirement: PermissionEnum[],
        roleRestriction?: Role[]
    ) {
        this.op = operation;
        if (!roleRestriction) {
            this.roleRestriction = ALL_ROLES;
        } else {
            this.roleRestriction = roleRestriction;
            this.limitedByRole = true;
        }

        this.permissionsAllowed = permissionRequirement.length > 0 ? permissionRequirement : ALL_PERMISSIONS;
    }

    VerifyPermission(permission: PermissionEnum): boolean {
        return this.permissionsAllowed.includes(permission);
    }

    VerifyRole(role: Role): boolean {
        return this.limitedByRole ? this.roleRestriction.includes(role) : true;
    }

    async Execute(input: Input, permission: PermissionEnum, role: Role): Promise<Output | undefined> {
        const proceed: boolean = this.VerifyPermission(permission) && this.VerifyRole(role);

        if (proceed) {
            return this.op(input);
        }
        return undefined;
    }
}
