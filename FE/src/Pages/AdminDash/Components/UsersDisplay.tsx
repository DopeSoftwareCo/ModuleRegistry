import {
    UsersDisplayContainer,
    UsersTable,
    UsersTableHead,
    UsersTableHeadRow,
    UsersTableHeadItem,
    UsersTableBody,
    UsersTableBodyRow,
    UsersTableBodyItem,
} from '../AdminDashStyle';
import { UserFromAPI } from '../Requests';

interface UsersDisplayProps {
    users?: UserFromAPI[];
}

export const UsersDisplay = ({ users = [] }: UsersDisplayProps) => {
    return (
        <UsersDisplayContainer>
            <UsersTable>
                <UsersTableHead>
                    <UsersTableHeadRow>
                        <UsersTableHeadItem>Id</UsersTableHeadItem>
                        <UsersTableHeadItem>Username</UsersTableHeadItem>

                        <UsersTableHeadItem>Permission</UsersTableHeadItem>
                        <UsersTableHeadItem>Role</UsersTableHeadItem>
                    </UsersTableHeadRow>
                </UsersTableHead>
                <UsersTableBody>
                    {users
                        .filter((user) => !user.username.includes('default'))
                        .map((user, idx) => (
                            <UsersTableBodyRow key={idx}>
                                <UsersTableBodyItem>{user.user_id}</UsersTableBodyItem>
                                <UsersTableBodyItem>{user.username}</UsersTableBodyItem>
                                <UsersTableBodyItem>{user.user_metadata.permission}</UsersTableBodyItem>
                                <UsersTableBodyItem>{user.user_metadata.role}</UsersTableBodyItem>
                            </UsersTableBodyRow>
                        ))}
                </UsersTableBody>
            </UsersTable>
        </UsersDisplayContainer>
    );
};
