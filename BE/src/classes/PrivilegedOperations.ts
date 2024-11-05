import { Role, UDS } from "./Users/subdir.const";
import * as jsonwebtoken from "jsonwebtoken";
import { Permission } from "./Users/subdir.const";

const ALL_ROLES: Role[] = [0, 1, 2, 3];
export const ALL_PERMISSIONS: Permission[] = [0, 1, 2, 3, 4, 5, 6, 7];

export class RestrictedOperation {
    roleRestriction: Role[];
    permissionsAllowed: Permission[];
    limitedByRole: boolean = false;

    constructor(permissionRequirement: Permission[], roleRestriction?: Role[]) {
        if (!roleRestriction) {
            this.roleRestriction = ALL_ROLES;
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
        return this.limitedByRole ? this.roleRestriction.includes(role) : true;
    }

    Execute(decodedToken: jsonwebtoken.TokenType): boolean | undefined {
        const permission = decodedToken.metadata.permission;
        const role = decodedToken.metadata.role;
        console.log("ROLE", role);
        console.log(typeof permission);
        console.log(this.VerifyPermission(permission));
        console.log(this.VerifyRole(role));
        const proceed: boolean = this.VerifyPermission(permission) && this.VerifyRole(role);

        return proceed;
    }
}

export class Mock_RestrictedOperation<Input, Output> {
    op: (input: Input) => Output;
    roleRestriction: Role[];
    permissionsAllowed: Permission[];
    limitedByRole: boolean = false;
    voidInput = false;

    constructor(
        operation: (input: Input) => Output,
        permissionRequirement: Permission[],
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

    VerifyPermission(permission: Permission): boolean {
        return this.permissionsAllowed.includes(permission);
    }

    VerifyRole(role: Role): boolean {
        return this.limitedByRole ? this.roleRestriction.includes(role) : true;
    }

    async Execute(input: Input, permission: Permission, role: Role): Promise<Output | undefined> {
        const proceed: boolean = this.VerifyPermission(permission) && this.VerifyRole(role);

        if (proceed) {
            return this.op(input);
        }
        return undefined;
    }
}
