import styled, { css } from 'styled-components';
import { StyledBaseDiv } from '../../BaseStyledComponents/BaseStyled';
import { useEffect } from 'react';

export const ErrorMessage = styled(StyledBaseDiv)`
    ${({ theme }) => css`
        color: ${theme.colors.errorRed};
    `}
`;

interface ErrorDisplayProps {
    err: string | undefined;
    setErr: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export const ErrorDisplay = ({ err, setErr }: ErrorDisplayProps) => {
    useEffect(() => {
        let timeout: NodeJS.Timeout | null = null;
        if (err) {
            timeout = setTimeout(() => {
                setErr(undefined);
            }, 5000);
        }
        return () => {
            if (timeout) {
                clearTimeout(timeout);
            }
        };
    }, [err, setErr]);

    if (!err) {
        return null;
    }

    return <ErrorMessage>{err}</ErrorMessage>;
};
