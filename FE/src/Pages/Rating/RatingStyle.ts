import styled, { css } from 'styled-components';
import { StyledBaseButton, StyledBaseDiv, StyledBaseTextInput } from '../../BaseStyledComponents/BaseStyled';

export const Inputs = styled(StyledBaseDiv)`
    display: flex;
    gap: 1rem;
`;

export const RatingRow = styled(StyledBaseDiv)`
    display: flex;
    justify-content: space-between;
    ${({ theme }) => css`
        min-width: 50vw;
        @media screen and (max-width: ${theme.breakpoint}) {
        }
    `}
`;
export const RatingName = styled(StyledBaseDiv)``;
export const RatingValue = styled(StyledBaseDiv)``;

export const RatingIDInput = styled(StyledBaseTextInput)``;

export const RatingRequestButton = styled(StyledBaseButton)``;
