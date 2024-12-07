import styled from 'styled-components';
import { StyledBaseButton, StyledBaseDiv, StyledBaseTextInput } from '../../BaseStyledComponents/BaseStyled';

export const PackagesInputs = styled(StyledBaseDiv)`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
`;

export const PackagesInput = styled(StyledBaseTextInput)``;

export const PackagesRequestButton = styled(StyledBaseButton)``;

export const PackagesResultName = styled(StyledBaseDiv)``;

export const PackagesResultVersion = styled(StyledBaseDiv)``;

export const RequestRow = styled(StyledBaseDiv)`
    display: flex;
    flex-direction: row;
    gap: 1rem;
`;

export const ButtonsRow = styled(StyledBaseDiv)`
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 1rem;
    margin-top: 1rem;
    align-items: center;
`;

export const RemoveButton = styled(StyledBaseButton)``;
