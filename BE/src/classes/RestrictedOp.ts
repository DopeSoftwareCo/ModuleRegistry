import { Role, UDS } from "./Users/subdir.const";
import * as jsonwebtoken from "jsonwebtoken";
import { Permission } from "./Users/subdir.const";

const ALL_ROLES: Role[] = [0, 1, 2, 3];
export const ALL_PERMISSIONS: Permission[] = [0, 1, 2, 3, 4, 5, 6, 7];

interface Restricted_Return<T> {
    returnVal: T | undefined;
    badInput: boolean;
}

const BadCallToRestricted: Restricted_Return<any> = { returnVal: undefined, badInput: true };
const UnathorizedCall: Restricted_Return<any> = { returnVal: undefined, badInput: false };

export class RestrictedOp<Output> {
    exampleInput: any[];
    op: (input: any[]) => Promise<Output>;
    roleRestriction: Role[];
    permissionsAllowed: Permission[];
    limitedByRole: boolean = false;
    voidInput = false;

    constructor(
        exampleInput: any[],
        operation: (input: any[]) => Promise<Output>,
        permissionRequirement: Permission[],
        roleRestriction?: Role[]
    ) {
        this.exampleInput = exampleInput;
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

    GuardInput(input: any[]): boolean {
        let i = 0;
        this.exampleInput.forEach((arg) => {
            if (typeof arg !== typeof input[i]) {
                return false;
            }
        });
        return true;
    }

    async Execute(input: any[], permission: Permission, role: Role): Promise<Restricted_Return<Output>> {
        const proceed: boolean = this.VerifyPermission(permission) && this.VerifyRole(role);
        if (!proceed) {
            return UnathorizedCall;
        }

        const goodInput = this.GuardInput(input);
        if (!goodInput) {
            return BadCallToRestricted;
        }

        // Now we have authorization and valid input!
        try {
            const returnVal = await this.op(input);
            return { returnVal: returnVal, badInput: false };
        } catch (error) {
            return BadCallToRestricted;
        }
    }
}
