import { Permission, Role } from "./UserData";

export interface RegistrationInfo {
    email: string;
    password: string;
    permission: Permission;
    role: Role;
    username: string;
}

export interface UpdateUserRequest_DevFriendly {
    uid: string;
    username?: string;
    password?: string;
    permission?: number;
    role?: number;
}

export interface Auth0User {
    user_id: string;
    name: string;
    email: string;
    username: string;
    user_metadata: {
        permission: number;
        role: number;
    };
    created_at?: string;
    last_login?: string;
    logins_count?: number;
}

export interface UpdateUserRequest {
    user_id?: string;
    name?: string;
    email?: string;
    username?: string;
    user_metadata: {
        permission?: number;
        role?: number;
    };
    password?: string;
}

export type IndexableAuth0User = Auth0User & {
    [key: string]: any;
};
