export type UDS = {
    U: boolean;
    D: boolean;
    S: boolean;
};

export const UDS_OBJECTS: Array<UDS> = [
    { U: false, D: false, S: false },
    { U: false, D: false, S: true },
    { U: false, D: true, S: false },
    { U: false, D: true, S: true },
    { U: true, D: false, S: false },
    { U: true, D: false, S: true },
    { U: true, D: true, S: false },
    { U: true, D: true, S: true },
];

export enum Role {
    Unknown = 0,
    External = 1,
    Internal = 2,
    Admin = 3,
}

export enum Permission {
    _000 = 0,
    _001 = 1,
    _010 = 2,
    _011 = 3,
    _100 = 4,
    _101 = 5,
    _110 = 6,
    _111 = 7,
}

export const SearchPerms = [Permission._001, Permission._011, Permission._111, Permission._101];
export const DownloadPerms = [Permission._010, Permission._011, Permission._110, Permission._111];
export const UploadPerms = [Permission._100, Permission._101, Permission._110, Permission._111];

export const DEFAULT_USERNAME = "ece30861defaultadminuser";
export const essential_attributes = "user_id,username,user_metadata";

export const ALL_ROLES: Role[] = [0, 1, 2, 3];
export const ALL_PERMISSIONS: Permission[] = [0, 1, 2, 3, 4, 5, 6, 7];
