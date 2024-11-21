import { PermissionEnum, Role } from '../../BETypes/PermissionsRoles';
import { GeneralConfig } from '../../Config/config';

export interface AddUserRequestBody {
    email: string;
    password: string;
    permission: PermissionEnum;
    role: Role;
    username: string;
}

export const addUserRequest = async (
    body: AddUserRequestBody,
    errorSetter: (error: string) => void,
    successSetter: (successMessage: string) => void
): Promise<void> => {
    try {
        const response = await fetch(`${GeneralConfig.BACKEND_URL}users/adduser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            const responseText = await response.text();
            errorSetter(responseText);
        } else if (response.ok) {
            const responseText = await response.text();
            successSetter(responseText);
        }
    } catch (err) {
        if (err instanceof Error) {
            errorSetter(err.message);
        } else errorSetter('some unknown error curred in addUserRequest');
    }
};

export const deleteUserRequest = async (
    id: string,
    errorSetter: (error: string) => void,
    successSetter: (successMessage: string) => void
): Promise<void> => {
    try {
        const response = await fetch(`${GeneralConfig.BACKEND_URL}users/deleteuser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ id }),
        });
        if (!response.ok) {
            const responseText = await response.text();
            errorSetter(responseText);
        } else if (response.ok) {
            const responseText = await response.text();
            successSetter(responseText);
        }
    } catch (err) {
        if (err instanceof Error) {
            errorSetter(err.message);
        } else errorSetter('some unknown error curred in deleteUserRequest');
    }
};

export interface UpdateUserRequestBody {
    id?: string;
    username?: string;
    password?: string;
    permission?: PermissionEnum;
    role?: Role;
}

export const updateUserRequest = async (
    body: UpdateUserRequestBody,
    errorSetter: (error: string) => void,
    successSetter: (successMessage: string) => void
): Promise<void> => {
    try {
        const response = await fetch(`${GeneralConfig.BACKEND_URL}users/updateuser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            const responseText = await response.text();
            errorSetter(responseText);
        } else if (response.ok) {
            const responseText = await response.text();
            successSetter(responseText);
        }
    } catch (err) {
        if (err instanceof Error) {
            errorSetter(err.message);
        } else errorSetter('some unknown error curred in updateUserRequest');
    }
};
