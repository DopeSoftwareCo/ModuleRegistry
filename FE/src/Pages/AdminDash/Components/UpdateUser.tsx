import { useState } from 'react';
import { StyledBaseTextInput } from '../../../BaseStyledComponents/BaseStyled';
import {
    AdminDashboardInputLabel,
    AdminDashboardInputs,
    AdminDashboardInputsContainer,
} from '../AdminDashStyle';
import { StatusDisplay } from '../../../Components/StatusDisplay/StatusDisplay';

interface UpdateUserProps {
    reloadTrigger: () => void;
}

export const UpdateUser = ({ reloadTrigger }: UpdateUserProps) => {
    const [err, setErr] = useState<undefined | string>(undefined);
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);
    const [username, setUsername] = useState<string | undefined>(undefined);
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

    return (
        <AdminDashboardInputsContainer>
            <AdminDashboardInputs>
                <AdminDashboardInputLabel>username</AdminDashboardInputLabel>
                <StyledBaseTextInput onChange={(e) => setUsername(e.target.value)} />
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
            <StatusDisplay
                err={err}
                setErr={setErr}
                successMessage={successMessage}
                setSuccess={setSuccessMessage}
            />
        </AdminDashboardInputsContainer>
    );
};
