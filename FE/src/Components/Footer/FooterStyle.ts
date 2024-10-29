import styled, { css } from 'styled-components';
import { StyledBaseA, StyledBaseDiv } from '../../BaseStyledComponents/BaseStyled';

export const FooterContainer = styled(StyledBaseDiv)`
    width: 100vw;
    overflow: hidden;
    display: flex;
    justify-content: center;
`;

export const FooterInnerContainer = styled(StyledBaseDiv)`
    width: 98%;
    display: flex;
    justify-content: space-between;
    padding-bottom: 10px;
    padding-top: 10px;
    ${({ theme }) => css`
        @media screen and (max-width: ${theme.breakpoint}) {
            flex-direction: column;
            align-items: center;
        }
    `}
`;

export const FooterLeftInformationContainer = styled(StyledBaseDiv)`
    background: inherit;
`;
export const FooterInformationItem = styled(StyledBaseDiv)`
    background: inherit;
    font-weight: 600;
`;
export const FooterLink = styled(StyledBaseA)``;
