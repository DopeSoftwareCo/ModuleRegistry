import { useState } from 'react';
import { StyledBaseButton, StyledBasePageContiner } from '../../BaseStyledComponents/BaseStyled';
import { StatusDisplay } from '../../Components/StatusDisplay/StatusDisplay';
import { deleteUserRequest } from '../AdminDash/Requests';
import { useNavigate } from 'react-router-dom';

export const Account = () => {
    const [err, setErr] = useState<undefined | string>(undefined);
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);
    const navigate = useNavigate();
    const deleteSelf = async () => {
        const myId = localStorage.getItem('userId');
        const userName = localStorage.getItem('username');
        if (userName?.includes('default')) {
            setErr('The default user may not delete his/her self.');
        } else if (myId) {
            await deleteUserRequest(
                myId,
                (errorMessage) => setErr(errorMessage),
                (success) => setSuccessMessage(success)
            );
            navigate('/auth');
        }
    };
    return (
        <StyledBasePageContiner>
            <StyledBaseButton aria-label="Delete self" onClick={deleteSelf}>
                Delete Self
            </StyledBaseButton>
            <StatusDisplay
                err={err}
                setErr={setErr}
                successMessage={successMessage}
                setSuccess={setSuccessMessage}
            />
        </StyledBasePageContiner>
    );
};
