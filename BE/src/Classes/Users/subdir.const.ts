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
