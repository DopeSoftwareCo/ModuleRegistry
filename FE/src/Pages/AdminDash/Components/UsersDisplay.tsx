import { StyledBaseDiv } from '../../../BaseStyledComponents/BaseStyled';
import { UserContainer, UsersDisplayContainer } from '../AdminDashStyle';
import { UserFromAPI } from '../Requests';

interface UsersDisplayProps {
    users?: UserFromAPI[];
}

export const UsersDisplay = ({ users = [] }: UsersDisplayProps) => {
    return (
        <UsersDisplayContainer>
            {users
                .filter((user) => !user.username.includes('default'))
                .map((user, idx) => (
                    <UserContainer key={idx}>
                        <StyledBaseDiv>{user.username}</StyledBaseDiv>
                        <StyledBaseDiv>{user.user_id}</StyledBaseDiv>
                        <StyledBaseDiv>{user.user_metadata.permission}</StyledBaseDiv>
                        <StyledBaseDiv>{user.user_metadata.role}</StyledBaseDiv>
                    </UserContainer>
                ))}
        </UsersDisplayContainer>
    );
};
