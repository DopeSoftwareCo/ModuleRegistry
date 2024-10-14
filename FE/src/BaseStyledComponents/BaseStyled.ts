import { darken, lighten } from 'polished';
import styled, { css } from 'styled-components';

export const StyledBaseButton = styled.button`
    border: none;
    font-family: inherit;
    background: inherit;
    padding: 0.2rem 0.4rem;
    font-size: inherit;
    text-transform: uppercase;
    font-weight: 600;
    ${({ theme }) => css`
        color: ${theme.colors.background};
        border-radius: ${theme.borderRadius.small};
        background: ${theme.colors.text};
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
        background: ${theme.colors.black};
        color: ${theme.colors.text};
        padding: ${theme.padding.small};
        &:focus {
            border: 1px solid ${theme.colors.skyBlue};
            outline: none;
            box-shadow: 0px 0px 10px -5px ${darken(0.05, theme.colors.skyBlue)};
        }
    `}
`;

export const StyledBaseCard = styled(StyledBaseDiv)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    ${({ theme }) => css`
        box-shadow: 0px 0px 10px -2px ${darken(0.05, theme.colors.skyBlue)};
        border: 1px solid ${theme.colors.skyBlue};
        border-radius: ${theme.borderRadius.medium};
        padding: ${theme.padding.large};
        @media screen and (max-width: ${theme.breakpoint}) {
        }
    `}
`;
