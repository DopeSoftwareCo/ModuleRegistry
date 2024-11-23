import { useState } from 'react';
import { StyledBaseButton, StyledBaseTextInput } from '../../../BaseStyledComponents/BaseStyled';
import {
    AddUpdateDeleteHeader,
    AdminDashboardInputLabel,
    AdminDashboardInputs,
    AdminDashboardInputsContainer,
} from '../AdminDashStyle';
import { StatusDisplay } from '../../../Components/StatusDisplay/StatusDisplay';
import { addUserRequest } from '../Requests';

interface AddUserProps {
    reloadTrigger: () => void;
}

export const AddUser = ({ reloadTrigger }: AddUserProps) => {
    const [err, setErr] = useState<undefined | string>(undefined);
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);
    const [username, setUsername] = useState<string | undefined>(undefined);
    const [email, setEmail] = useState<string | undefined>(undefined);
    const [password, setPassword] = useState<string | undefined>(undefined);
    const [permission, setPermission] = useState<number | undefined>(undefined);
    const [role, setRole] = useState<number | undefined>(undefined);

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

    const buildAddUserRequestBody = () => ({
        ...(email ? { email } : { email: '' }),
        ...(password ? { password } : { password: '' }),
        ...(permission ? { permission } : { permission: 0 }),
        ...(role ? { role } : { role: 0 }),
        ...(username ? { username } : { username: '' }),
    });

    const makeAddUserRequest = async () => {
        await addUserRequest(
            buildAddUserRequestBody(),
            (error) => setErr(error),
            (success) => setSuccessMessage(success)
        );
        reloadTrigger();
    };

    return (
        <AdminDashboardInputsContainer>
            <AddUpdateDeleteHeader>Adding User</AddUpdateDeleteHeader>
            <AdminDashboardInputs>
                <AdminDashboardInputLabel>username</AdminDashboardInputLabel>
                <StyledBaseTextInput onChange={(e) => setUsername(e.target.value)} />
            </AdminDashboardInputs>
            <AdminDashboardInputs>
                <AdminDashboardInputLabel>email</AdminDashboardInputLabel>
                <StyledBaseTextInput onChange={(e) => setEmail(e.target.value)} />
            </AdminDashboardInputs>
            <AdminDashboardInputs>
                <AdminDashboardInputLabel>password</AdminDashboardInputLabel>
                <StyledBaseTextInput onChange={(e) => setPassword(e.target.value)} />
            </AdminDashboardInputs>
            <AdminDashboardInputs>
                <AdminDashboardInputLabel>permission</AdminDashboardInputLabel>
                <StyledBaseTextInput onChange={(e) => permissionRoleOnChange(e, setPermission)} />
            </AdminDashboardInputs>
            <AdminDashboardInputs>
                <AdminDashboardInputLabel>role</AdminDashboardInputLabel>
                <StyledBaseTextInput onChange={(e) => permissionRoleOnChange(e, setRole)} />
            </AdminDashboardInputs>
            <StyledBaseButton onClick={makeAddUserRequest}>Add User</StyledBaseButton>
            <StatusDisplay
                err={err}
                setErr={setErr}
                successMessage={successMessage}
                setSuccess={setSuccessMessage}
            />
        </AdminDashboardInputsContainer>
    );
};
