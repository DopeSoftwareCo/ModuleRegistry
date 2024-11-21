import { StyledBaseTextInput } from '../../../BaseStyledComponents/BaseStyled';
import {
    AdminDashboardInputLabel,
    AdminDashboardInputs,
    AdminDashboardInputsContainer,
} from '../AdminDashStyle';

export const DeleteUser = () => {
    return (
        <AdminDashboardInputsContainer>
            <AdminDashboardInputs>
                <AdminDashboardInputLabel>id</AdminDashboardInputLabel>
                <StyledBaseTextInput />
            </AdminDashboardInputs>
        </AdminDashboardInputsContainer>
    );
};
