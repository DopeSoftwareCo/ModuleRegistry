import { Permission, Role } from "../Users/subdir.const";
import { Comparison, Interpret } from "./Interpretation";
import { BadCallToRestricted, Restrictable_Op, Restricted_Return, UnathorizedCall } from "./subdir.types";

export const ALL_ROLES: Role[] = [0, 1, 2, 3];
export const ALL_PERMISSIONS: Permission[] = [0, 1, 2, 3, 4, 5, 6, 7];

export const ALLOW_U: Permission[] = [Permission._111, Permission._110, Permission._101, Permission._100];
export const ALLOW_D: Permission[] = [Permission._111, Permission._110, Permission._011, Permission._010];
export const ALLOW_S: Permission[] = [Permission._111, Permission._101, Permission._011, Permission._001];

interface InterpreterSpec<Type> {
    as: boolean;
    comparisonType: Comparison;
    benchmark: Type;
}

export class OpUnderRestriction<Output> {
    protected interpreter: Function = Interpret<any>;
    protected exampleInput: any;
    protected op: Restrictable_Op<Output>;
    protected rolesAllowed: Role[];
    protected permissionsAllowed: Permission[];
    protected limitedByRole;
    protected expectVoid;
    protected expectArray;
    protected interpreterSpec;

    constructor(
        operation: Restrictable_Op<Output>,
        permissionRequirement: Permission[],
        roleRestriction?: Role[],
        exampleInput: any = undefined,
        interpreterSpec?: InterpreterSpec<Output>
    ) {
        this.exampleInput = exampleInput;
        this.expectVoid = exampleInput == undefined;
        this.expectArray = this.expectVoid ? false : Array.isArray(exampleInput);

        this.op = operation;
        this.limitedByRole = roleRestriction == undefined;
        this.rolesAllowed = this.ValidateRestriction(ALL_ROLES, roleRestriction);
        this.permissionsAllowed = this.ValidateRestriction(ALL_PERMISSIONS, permissionRequirement);

        this.interpreterSpec = interpreterSpec;
    }

    protected ValidateRestriction(defaultVals: number[], request?: number[]): number[] {
        if (request) {
            return request.length > 0 ? request : defaultVals;
        }
        return defaultVals;
    }

    VerifyPermission(permission: Permission): boolean {
        return this.permissionsAllowed.includes(permission);
    }

    VerifyRole(role: Role): boolean {
        return this.limitedByRole ? this.rolesAllowed.includes(role) : true;
    }

    GuardInput(input: any): boolean {
        if (this.expectArray) {
            return this.Guard_Array(input);
        } else {
            return typeof this.exampleInput === typeof input;
        }
    }

    Guard_Array(input: any[]) {
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

    protected Interpret(ThisResult: Output, That: InterpreterSpec<Output>): boolean {
        return this.interpreter(ThisResult, That.as, That.comparisonType, That.benchmark);
    }

    get InterpreterSpec(): InterpreterSpec<Output> | undefined {
        return this.interpreterSpec;
    }

    async Execute(permission: Permission, role: Role, input?: any): Promise<Restricted_Return<Output>> {
        const proceed: boolean = this.VerifyPermission(permission) && this.VerifyRole(role);
        if (!proceed) {
            return UnathorizedCall;
        }

        // Now we have authorization
        try {
            const goodInput = input ? this.GuardInput(input) : this.expectVoid;
            if (!goodInput) {
                return BadCallToRestricted;
            }
            // And now we have "valid" input
            const returnVal = await this.op(input);

            const interpretation = this.interpreterSpec
                ? this.Interpret(returnVal, this.interpreterSpec)
                : undefined;
            return {
                returnVal: returnVal,
                interpretation: interpretation,
                failedToAuthorize: false,
                badInput: false,
            };
        } catch (error) {
            return BadCallToRestricted;
        }
    }
}
