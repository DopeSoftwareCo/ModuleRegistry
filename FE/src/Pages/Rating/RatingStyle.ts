import styled, { css } from 'styled-components';
import { StyledBaseButton, StyledBaseDiv, StyledBaseTextInput } from '../../BaseStyledComponents/BaseStyled';

export const Inputs = styled(StyledBaseDiv)`
    display: flex;
    gap: 1rem;
`;

export const ErrorMessage = styled(StyledBaseDiv)`
    ${({ theme }) => css`
        color: ${theme.colors.errorRed};
    `}
`;

export const RatingName = styled(StyledBaseDiv)``;
export const RatingValue = styled(StyledBaseDiv)``;

export const RatingIDInput = styled(StyledBaseTextInput)``;

export const RatingRequestButton = styled(StyledBaseButton)``;
