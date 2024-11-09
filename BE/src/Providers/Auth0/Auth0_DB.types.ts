import { Permission, Role } from "../../Classes/Users/subdir.const";

export interface RegistrationInfo {
    email: string;
    password: string;
    permission: Permission;
    role: Role;
    username: string;
}

export interface RequestForUserChanges {
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
