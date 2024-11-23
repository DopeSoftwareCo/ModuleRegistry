import { useEffect, useState } from 'react';
import { StyledBaseButton, StyledBasePageContiner } from '../../BaseStyledComponents/BaseStyled';
import { ButtonsContainer } from './AdminDashStyle';
import { AddUser } from './Components/AddUser';
import { UpdateUser } from './Components/UpdateUser';
import { DeleteUser } from './Components/DeleteUser';
import { UsersDisplay } from './Components/UsersDisplay';
import { AllUsersFromAPI, getAllUsers } from './Requests';
import { StatusDisplay } from '../../Components/StatusDisplay/StatusDisplay';
import { PossiblePermsRoles } from './Components/PossibleRoles';

enum AdminActions {
    ADD,
    UPDATE,
    DELETE,
}

const AdminDashboard = () => {
    const [action, setAction] = useState<AdminActions>(AdminActions.ADD);
    const [reloadFlipper, setReloadFlipper] = useState(false);
    const [users, setUsers] = useState<AllUsersFromAPI | undefined>(undefined);
    const [err, setErr] = useState<undefined | string>(undefined);
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);
    const getUsers = async () => {
        const usersFromAPI = await getAllUsers((errorMessage) => setErr(errorMessage));
        setUsers(usersFromAPI);
    };

    useEffect(() => {
        getUsers();
    }, [reloadFlipper]);

    const reloadTrigger = () => {
        setTimeout(() => {
            setReloadFlipper((prev) => !prev);
        }, 2000);
    };
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
            {(action === AdminActions.ADD || action === AdminActions.UPDATE) && <PossiblePermsRoles />}
            <UsersDisplay users={users?.users} />
            <StatusDisplay
                err={err}
                setErr={setErr}
                successMessage={successMessage}
                setSuccess={setSuccessMessage}
            />
        </StyledBasePageContiner>
    );
};

export default AdminDashboard;
