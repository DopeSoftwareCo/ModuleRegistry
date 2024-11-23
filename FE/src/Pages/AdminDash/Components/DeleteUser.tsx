import { useState } from 'react';
import { StyledBaseTextInput } from '../../../BaseStyledComponents/BaseStyled';
import {
    AdminDashboardInputLabel,
    AdminDashboardInputs,
    AdminDashboardInputsContainer,
} from '../AdminDashStyle';
import { StatusDisplay } from '../../../Components/StatusDisplay/StatusDisplay';

interface DeleteUserProps {
    reloadTrigger: () => void;
}

export const DeleteUser = ({ reloadTrigger }: DeleteUserProps) => {
    const [err, setErr] = useState<undefined | string>(undefined);
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);
    const [id, setId] = useState<string | undefined>(undefined);
    return (
        <AdminDashboardInputsContainer>
            <AdminDashboardInputs>
                <AdminDashboardInputLabel>id</AdminDashboardInputLabel>
                <StyledBaseTextInput onChange={(e) => setId(e.target.value)} />
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
