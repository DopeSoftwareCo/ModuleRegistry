import styled from 'styled-components';
import { StyledBaseDiv } from '../../BaseStyledComponents/BaseStyled';

export const AdminDashboardInputs = styled(StyledBaseDiv)`
    display: flex;
    gap: 1rem;
    min-width: 300px;
    justify-content: space-between;
`;

export const AdminDashboardInputLabel = styled(StyledBaseDiv)`
    text-transform: uppercase;
`;

export const ButtonsContainer = styled(StyledBaseDiv)`
    display: flex;
    gap: 1rem;
`;

export const AdminDashboardInputsContainer = styled(StyledBaseDiv)`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-width: 300px;
`;
