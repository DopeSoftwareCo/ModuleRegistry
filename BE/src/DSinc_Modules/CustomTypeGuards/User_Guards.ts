import { Admin } from "../../classes/Users/Admin";
import { Role, RoleCategory } from "../../classes/Users/Roles/subdir.const";
import { UDS } from "../../classes/Users/UDS_Permissions/subdir.const";
import { User } from "../../classes/Users/User";
import { SkeletonIsType } from "./ModEval_Guards";

export function IsType_User(value: any): value is User {
    const runChecks = (value: any) => {
        let failures = 0;

        failures += typeof value.uid === "string" ? 0 : 1;
        failures += typeof value.email === "string" ? 0 : 1;
        failures += IsType_UDS(value.UDS) ? 0 : 1;
        failures += IsType_Role(value) ? 0 : 1;

        return failures;
    };

    return SkeletonIsType<User>(value, runChecks);
}

export function IsType_Admin(value: any): value is Admin {
    const runChecks = (value: any) => {
        return IsType_User(value) && value.Role.category == RoleCategory.Admin ? 0 : 1;
    };

    return SkeletonIsType<Admin>(value, runChecks);
}

export function IsType_Role(value: any): value is Role {
    const runChecks = (value: any) => {
        let failures = 0;

        failures += typeof value.category === "number" ? 0 : 1;
        failures += typeof value.stringFormat === "string" ? 0 : 1;
        return failures;
    };

    return SkeletonIsType<Role>(value, runChecks);
}

export function IsType_UDS(value: any): value is UDS {
    const runChecks = (value: any) => {
        let failures = 0;

        failures += typeof value.U === "boolean" ? 0 : 1;
        failures += typeof value.D === "boolean" ? 0 : 1;
        failures += typeof value.S === "boolean" ? 0 : 1;
        return failures;
    };

    return SkeletonIsType<UDS>(value, runChecks);
}
