import styled, { css } from 'styled-components';
import { StyledBaseButton, StyledBaseDiv, StyledBaseTextInput } from '../../BaseStyledComponents/BaseStyled';

export const Inputs = styled(StyledBaseDiv)`
    display: flex;
    gap: 1rem;
`;

// The ID container will have vertical alignment since the checkbox will be below it.
export const IDContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
`;

export const CostIDInput = styled(StyledBaseTextInput)``;

export const CheckboxContainer = styled.div`
    display: flex;
    align-items: center;
`;

// Modify the size a bit to match
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
