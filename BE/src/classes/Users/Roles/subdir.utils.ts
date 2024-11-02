import { ROLES, UNKNOWN_ROLE, RoleCategory } from "./subdir.const";

export function ToRoleFromString(roleString: string) {
    const role = ROLES.find((element) => element.stringFormat === roleString);
    return role ? role : UNKNOWN_ROLE;
}

export function ToRoleFromCategory(cat: RoleCategory) {
    const role = ROLES.find((element) => element.category === cat);
    return role ? role : UNKNOWN_ROLE;
}
