import styled, { css } from 'styled-components';
import { StyledBaseDiv } from '../../BaseStyledComponents/BaseStyled';
import { useEffect } from 'react';

export const ErrorMessage = styled(StyledBaseDiv)`
    ${({ theme }) => css`
        color: ${theme.colors.errorRed};
    `}
`;
interface StatusProps {
    $isErr: string | undefined;
}
const Status = styled(StyledBaseDiv)<StatusProps>`
    ${({ theme, $isErr }) => css`
        color: ${$isErr ? theme.colors.errorRed : theme.colors.accentGreen};
    `}
`;

interface StatusDisplayProps {
    err: string | undefined;
    setErr: React.Dispatch<React.SetStateAction<string | undefined>>;
    successMessage: string | undefined;
    setSuccess: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export const StatusDisplay = ({ err, setErr, successMessage, setSuccess }: StatusDisplayProps) => {
    useEffect(() => {
        let timeout: NodeJS.Timeout | null = null;
        if (err || successMessage) {
            timeout = setTimeout(() => {
                if (err) {
                    setErr(undefined);
                }
                if (successMessage) {
                    setSuccess(undefined);
                }
            }, 10000);
        }
        return () => {
            if (timeout) {
                clearTimeout(timeout);
            }
        };
    }, [err, setErr, successMessage, setSuccess]);

    if (!err && !successMessage) {
        return null;
    }

    return <Status $isErr={err}>{err ? err : successMessage}</Status>;
};
