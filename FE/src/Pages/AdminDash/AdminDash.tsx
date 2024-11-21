import { useState } from 'react';
import { StyledBaseButton, StyledBasePageContiner } from '../../BaseStyledComponents/BaseStyled';
import { ButtonsContainer } from './AdminDashStyle';
import { AddUser } from './Components/AddUser';
import { UpdateUser } from './Components/UpdateUser';
import { DeleteUser } from './Components/DeleteUser';

enum AdminActions {
    ADD,
    UPDATE,
    DELETE,
}

const AdminDashboard = () => {
    const [action, setAction] = useState<AdminActions>(AdminActions.ADD);
    return (
        <StyledBasePageContiner>
            <ButtonsContainer>
                {action !== AdminActions.ADD && (
                    <StyledBaseButton onClick={() => setAction(AdminActions.ADD)}>ADD</StyledBaseButton>
                )}
                {action !== AdminActions.UPDATE && (
                    <StyledBaseButton onClick={() => setAction(AdminActions.UPDATE)}>UPDATE</StyledBaseButton>
                )}
                {action !== AdminActions.DELETE && (
                    <StyledBaseButton onClick={() => setAction(AdminActions.DELETE)}>DELETE</StyledBaseButton>
                )}
            </ButtonsContainer>
            {action === AdminActions.ADD && <AddUser />}
            {action === AdminActions.UPDATE && <UpdateUser />}
            {action === AdminActions.DELETE && <DeleteUser />}
        </StyledBasePageContiner>
    );
};

export default AdminDashboard;
