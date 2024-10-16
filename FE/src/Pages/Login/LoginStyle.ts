import styled, { css } from 'styled-components';
import {
    StyledBaseButton,
    StyledBaseCard,
    StyledBaseDiv,
    StyledBaseTextInput,
} from '../../BaseStyledComponents/BaseStyled';

export const LoginField = styled(StyledBaseTextInput)``;

export const PasswordField = styled(StyledBaseTextInput).attrs({ type: 'password' })``;

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
`;

export const LoginCard = styled(StyledBaseCard)`
    position: relative;
`;

export const LoginLabel = styled(StyledBaseDiv)`
    font-weight: 600;
    text-transform: uppercase;
    ${({ theme }) => css`
        font-size: ${theme.fontSizes.large};
    `}
`;

export const SubmitButton = styled(StyledBaseButton).attrs({ type: 'submit' })``;

export const ErrorMessage = styled(StyledBaseDiv)`
    background: transparent;
    position: absolute;
    bottom: -3rem;
    ${({ theme }) => css`
        color: ${theme.colors.errorRed};
        max-width: 250px;
        font-size: ${theme.fontSizes.small};
    `}
`;
