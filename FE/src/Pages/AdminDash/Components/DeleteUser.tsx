import { useState } from 'react';
import { StyledBaseButton, StyledBaseTextInput } from '../../../BaseStyledComponents/BaseStyled';
import {
    AdminDashboardInputLabel,
    AdminDashboardInputs,
    AdminDashboardInputsContainer,
} from '../AdminDashStyle';
import { StatusDisplay } from '../../../Components/StatusDisplay/StatusDisplay';
import { deleteUserRequest } from '../Requests';

interface DeleteUserProps {
    reloadTrigger: () => void;
}

export const DeleteUser = ({ reloadTrigger }: DeleteUserProps) => {
    const [err, setErr] = useState<undefined | string>(undefined);
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);
    const [id, setId] = useState<string | undefined>(undefined);
    const makeDeleteUserRequest = async () => {
        await deleteUserRequest(
            id ? id : '',
            (errorMessage) => setErr(errorMessage),
            (successMessage) => setSuccessMessage(successMessage)
        );
        reloadTrigger();
    };
    return (
        <AdminDashboardInputsContainer>
            <AdminDashboardInputs>
                <AdminDashboardInputLabel>id</AdminDashboardInputLabel>
                <StyledBaseTextInput onChange={(e) => setId(e.target.value)} />
            </AdminDashboardInputs>
            <StyledBaseButton onClick={makeDeleteUserRequest}>Delete User</StyledBaseButton>
            <StatusDisplay
                err={err}
                setErr={setErr}
                successMessage={successMessage}
                setSuccess={setSuccessMessage}
            />
        </AdminDashboardInputsContainer>
    );
};
