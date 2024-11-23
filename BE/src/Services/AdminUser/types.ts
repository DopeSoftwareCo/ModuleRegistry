import { Permission, Role } from "./UserData";

export interface RegistrationInfo {
    email: string;
    password: string;
    permission: Permission;
    role: Role;
    username: string;
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

export interface EssentialUserData {
    user_id: string;
    username: string;
    user_metadata: {
        permission: number;
        role: number;
    };
}

export interface UserUpdates {
    user_id?: string;
    name?: string;
    email?: string;
    username?: string;
    user_metadata?: {
        permission?: number;
        role?: number;
    };
    password?: string;
}

export type UserAttribute =
    | "user_id"
    | "name"
    | "email"
    | "username"
    | "user_metadata"
    | "user_metadata: { permission }"
    | "user_metadata: { role }"
    | "created_at"
    | "last_login"
    | "logins_count";
