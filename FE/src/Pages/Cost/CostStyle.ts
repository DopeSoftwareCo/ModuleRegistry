import styled, { css } from 'styled-components';
import { StyledBaseButton, StyledBaseDiv, StyledBaseTextInput } from '../../BaseStyledComponents/BaseStyled';

export const Inputs = styled(StyledBaseDiv)`
    display: flex;
    gap: 1rem;
`;

export const IDContainer = styled(StyledBaseDiv)``;

export const CostIDInput = styled(StyledBaseTextInput)``;

export const CheckboxContainer = styled(StyledBaseDiv)``;

// Modify the size a bit to match the size of the ID container
export const CostRequestButton = styled(StyledBaseButton)`
    height: 100%;
    min-height: 35px;
`;

export const CostLabel = styled(StyledBaseDiv)``;

export const CostValue = styled(StyledBaseDiv)``;

export const ErrorMessage = styled(StyledBaseDiv)`
    ${({ theme }) => css`
        color: ${theme.colors.errorRed};
    `}
`;
