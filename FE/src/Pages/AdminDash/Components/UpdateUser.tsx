import { useState } from 'react';
import { StyledBaseButton, StyledBaseTextInput } from '../../../BaseStyledComponents/BaseStyled';
import {
    AddUpdateDeleteHeader,
    AdminDashboardInputLabel,
    AdminDashboardInputs,
    AdminDashboardInputsContainer,
} from '../AdminDashStyle';
import { StatusDisplay } from '../../../Components/StatusDisplay/StatusDisplay';
import { updateUserRequest } from '../Requests';

interface UpdateUserProps {
    reloadTrigger: () => void;
}

export const UpdateUser = ({ reloadTrigger }: UpdateUserProps) => {
    const [err, setErr] = useState<undefined | string>(undefined);
    const [success, setSuccessMessage] = useState<string | undefined>(undefined);
    const [username, setUsername] = useState<string | undefined>(undefined);
    const [password, setPassword] = useState<string | undefined>(undefined);
    const [permission, setPermission] = useState<number | undefined>(undefined);
    const [role, setRole] = useState<number | undefined>(undefined);
    const [id, setId] = useState<string | undefined>(undefined);

    const permissionRoleOnChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        setter: React.Dispatch<React.SetStateAction<number | undefined>>
    ) => {
        try {
            const permNum = parseInt(e.target.value);
            setter(permNum);
        } catch (error) {
            if (error instanceof Error) {
                setErr(error.message);
            } else setErr('Error occured setting permission on change.');
        }
    };

    const buildUpdateUserRequestBody = () => ({
        id,
        ...(username ? { username } : {}),
        ...(password ? { password } : {}),
        ...(permission ? { permission } : {}),
        ...(role ? { role } : {}),
    });

    const makeUpdateUserRequest = async () => {
        await updateUserRequest(
            buildUpdateUserRequestBody(),
            (errorMessage) => setErr(errorMessage),
            (successMessage) => setSuccessMessage(successMessage)
        );
        reloadTrigger();
    };

    return (
        <AdminDashboardInputsContainer data-testid="admin-dash-update-user-container">
            <AddUpdateDeleteHeader>Updating User</AddUpdateDeleteHeader>
            <AdminDashboardInputs>
                <AdminDashboardInputLabel id="id">id</AdminDashboardInputLabel>
                <StyledBaseTextInput aria-labelledby="id" onChange={(e) => setId(e.target.value)} />
            </AdminDashboardInputs>
            <AdminDashboardInputs>
                <AdminDashboardInputLabel id="username">username</AdminDashboardInputLabel>
                <StyledBaseTextInput
                    aria-labelledby="username"
                    onChange={(e) => setUsername(e.target.value)}
                />
            </AdminDashboardInputs>
            <AdminDashboardInputs>
                <AdminDashboardInputLabel id="password">password</AdminDashboardInputLabel>
                <StyledBaseTextInput
                    aria-labelledby="password"
                    onChange={(e) => setPassword(e.target.value)}
                />
            </AdminDashboardInputs>
            <AdminDashboardInputs>
                <AdminDashboardInputLabel id="permission">permission</AdminDashboardInputLabel>
                <StyledBaseTextInput
                    aria-labelledby="permission"
                    onChange={(e) => permissionRoleOnChange(e, setPermission)}
                />
            </AdminDashboardInputs>
            <AdminDashboardInputs>
                <AdminDashboardInputLabel id="role">role</AdminDashboardInputLabel>
                <StyledBaseTextInput aria-label="role" onChange={(e) => permissionRoleOnChange(e, setRole)} />
            </AdminDashboardInputs>
            <StyledBaseButton aria-label="update user" onClick={makeUpdateUserRequest}>
                Update User
            </StyledBaseButton>
            <StatusDisplay
                err={err}
                setErr={setErr}
                successMessage={success}
                setSuccess={setSuccessMessage}
            />
        </AdminDashboardInputsContainer>
    );
};
