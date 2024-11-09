import { ObjectId } from "mongoDb";

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

export const ALL_ROLES: Role[] = [0, 1, 2, 3];
export const ALL_PERMISSIONS: Permission[] = [0, 1, 2, 3, 4, 5, 6, 7];

export const ALLOW_U: Permission[] = [Permission._111, Permission._110, Permission._101, Permission._100];
export const ALLOW_D: Permission[] = [Permission._111, Permission._110, Permission._011, Permission._010];
export const ALLOW_S: Permission[] = [Permission._111, Permission._101, Permission._011, Permission._001];

export const DEFAULT_UID = "someLongString";

export interface UpdatePackageRequest extends EditablePackageFields {
    ID: ObjectId;
}

export interface EditablePackageFields {
    fields: {
        Name?: string;
        Content?: string;
        URL?: string;
        JSProgram?: string;
        debloat?: boolean;
    };
}

export enum UpdateType {
    Major = 0,
    Minor = 1,
    Patch = 2,
}
