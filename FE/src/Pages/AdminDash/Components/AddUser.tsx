import { StyledBaseTextInput } from '../../../BaseStyledComponents/BaseStyled';
import {
    AdminDashboardInputLabel,
    AdminDashboardInputs,
    AdminDashboardInputsContainer,
} from '../AdminDashStyle';

export const AddUser = () => {
    return (
        <AdminDashboardInputsContainer>
            <AdminDashboardInputs>
                <AdminDashboardInputLabel>username</AdminDashboardInputLabel>
                <StyledBaseTextInput />
            </AdminDashboardInputs>
            <AdminDashboardInputs>
                <AdminDashboardInputLabel>email</AdminDashboardInputLabel>
                <StyledBaseTextInput />
            </AdminDashboardInputs>
            <AdminDashboardInputs>
                <AdminDashboardInputLabel>password</AdminDashboardInputLabel>
                <StyledBaseTextInput />
            </AdminDashboardInputs>
            <AdminDashboardInputs>
                <AdminDashboardInputLabel>permission</AdminDashboardInputLabel>
                <StyledBaseTextInput />
            </AdminDashboardInputs>
            <AdminDashboardInputs>
                <AdminDashboardInputLabel>role</AdminDashboardInputLabel>
                <StyledBaseTextInput />
            </AdminDashboardInputs>
        </AdminDashboardInputsContainer>
    );
};
