export enum RoleCategory {
    Unknown = 0,
    External = 1,
    Internal = 2,
    Admin = 3,
}

export type Role_EnumAndString = { enumType: number; stringType: string };

export const UNKNOWN_ROLE: Role = { category: RoleCategory.Unknown, stringFormat: RoleCategory[0] };
export const INTERN_ROLE: Role = { category: RoleCategory.Internal, stringFormat: RoleCategory[2] };
export const EXTERN_ROLE: Role = { category: RoleCategory.External, stringFormat: RoleCategory[1] };
export const ADMIN_ROLE: Role = { category: RoleCategory.Admin, stringFormat: RoleCategory[3] };

export interface Role {
    category: RoleCategory;
    stringFormat: string;
}

export const ROLES: Array<Role> = [UNKNOWN_ROLE, INTERN_ROLE, EXTERN_ROLE, ADMIN_ROLE];
