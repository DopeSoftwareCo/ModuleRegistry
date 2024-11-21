import { Permission, Role } from "../Users/subdir.const";

export const ALL_ROLES: Role[] = [0, 1, 2, 3];
export const ALL_PERMISSIONS: Permission[] = [0, 1, 2, 3, 4, 5, 6, 7];

export interface Restricted_Return<T> {
    returnVal: T | undefined;
    failedToAuthorize: boolean;
    badInput: boolean;
}

export const BadCallToRestricted: Restricted_Return<any> = {
    returnVal: undefined,
    failedToAuthorize: false,
    badInput: true,
};
export const UnathorizedCall: Restricted_Return<any> = {
    returnVal: undefined,
    failedToAuthorize: true,
    badInput: false,
};

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
        this.voidInput = exampleInput.length == 0;
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
        const size = this.exampleInput.length;
        let match = true;
        for (let i = 0; i < size; i++) {
            if (typeof this.exampleInput[i] !== typeof input[i]) {
                match = false;
                break;
            }
        }
        console.log(match);
        return match;
    }

    async Execute(input: any[], permission: Permission, role: Role): Promise<Restricted_Return<Output>> {
        const proceed: boolean = this.VerifyPermission(permission) && this.VerifyRole(role);
        if (!proceed) {
            return UnathorizedCall;
        }

        const goodInput = this.voidInput ? true : this.GuardInput(input);
        if (!goodInput) {
            return BadCallToRestricted;
        }

        // Now we have authorization and valid input!
        try {
            const returnVal = await this.op(input);
            return { returnVal: returnVal, failedToAuthorize: false, badInput: false };
        } catch (error) {
            return BadCallToRestricted;
        }
    }
}
