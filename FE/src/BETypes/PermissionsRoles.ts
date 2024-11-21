export enum Role {
    Unknown = 0,
    External = 1,
    Internal = 2,
    Admin = 3,
}

export enum PermissionEnum {
    _000 = 0,
    _001 = 1,
    _010 = 2,
    _011 = 3,
    _100 = 4,
    _101 = 5,
    _110 = 6,
    _111 = 7,
}

export const SearchPerms = [
    PermissionEnum._001,
    PermissionEnum._011,
    PermissionEnum._111,
    PermissionEnum._101,
];
export const DownloadPerms = [
    PermissionEnum._010,
    PermissionEnum._011,
    PermissionEnum._110,
    PermissionEnum._111,
];
export const UploadPerms = [
    PermissionEnum._100,
    PermissionEnum._101,
    PermissionEnum._110,
    PermissionEnum._111,
];
export const ALL_PERMS_ALLOWED: PermissionEnum[] = Object.values(PermissionEnum).filter(
    (value) => typeof value === 'number'
) as PermissionEnum[];
export const ALL_ROLES: Role[] = Object.values(Role).filter((value) => typeof value === 'number') as Role[];
