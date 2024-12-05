import { useState } from 'react';
import { StyledBaseButton } from '../../BaseStyledComponents/BaseStyled';
import { StatusDisplay } from '../../Components/StatusDisplay/StatusDisplay';
import { resetRegistryRequest } from './Requests';
import { ResetContainer } from './ResetStyle';

const Reset = () => {
    const [err, setErr] = useState<undefined | string>(undefined);
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);
    const handleResetButtonClick = async () => {
        resetRegistryRequest(
            (error) => setErr(error),
            (success) => setSuccessMessage(success)
        );
    };
    return (
        <ResetContainer>
            <StyledBaseButton
                aria-label="Reset button DANGER"
                data-testid="reset-button"
                onClick={handleResetButtonClick}
            >
                Reset
            </StyledBaseButton>{' '}
            <StatusDisplay
                err={err}
                setErr={setErr}
                successMessage={successMessage}
                setSuccess={setSuccessMessage}
            />
        </ResetContainer>
    );
};

export default Reset;
