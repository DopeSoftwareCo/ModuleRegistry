import { darken, lighten } from 'polished';
import styled, { css } from 'styled-components';

export const StyledBaseButton = styled.button`
    border: none;
    font-family: inherit;
    background: inherit;
    padding: 0.2rem 0.4rem;
    font-size: inherit;
    ${({ theme }) => css`
        border-radius: ${theme.borderRadius.small};
        background: ${theme.colors.skyBlue};
        padding: 0.2rem ${theme.padding.small};
        &:hover {
            cursor: pointer;
            background: ${lighten(0.1, theme.colors.accentCyan)};
        }
    `}
`;

export const StyledBaseDiv = styled.div`
    ${({ theme }) => css`
        background: ${theme.colors.background};
        color: ${theme.colors.text};
    `}
`;

export const StyledBaseA = styled.a`
    ${({ theme }) => css`
        background: ${theme.colors.background};
        color: ${theme.colors.text};
    `}
`;

export const StyledBaseTextInput = styled.input.attrs({ type: 'text' })`
    font-family: inherit;
    ${({ theme }) => css`
        border-radius: ${theme.borderRadius.small};
        border: 1px solid ${theme.colors.text};
        outline: none
        background: ${theme.colors.background};
        color: ${theme.colors.text};
        &:focus {
            border: 1px solid ${theme.colors.skyBlue};
        outline: none;
            box-shadow: 0px 0px 10px -5px ${darken(0.05, theme.colors.skyBlue)};
        }
    `}
`;
