import styled, { css } from 'styled-components';
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
    align-items: center;
`;

export const UsersDisplayContainer = styled(StyledBaseDiv)`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1rem;
    ${({ theme }) => css`
        @media screen and (max-width: ${theme.breakpoint}) {
            flex-direction: column;
        }
    `}
`;

export const UserContainer = styled(StyledBaseDiv)`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    ${({ theme }) => css`
        padding: ${theme.padding.small};
        border: 1px solid ${theme.colors.text};
        border-radius: ${theme.borderRadius.medium};
    `}
`;

export const UserInformationRow = styled(StyledBaseDiv)`
    display: flex;
    justify-content: space-between;
    min-width: 300px;
`;

export const UserInformationIdentifier = styled(StyledBaseDiv)`
    font-weight: 600;
    text-transform: uppercase;
`;

export const UsersTable = styled.table`
    ${({ theme }) => css`
        color: ${theme.colors.text};
        border: 1px solid ${theme.colors.text};
        border-collapse: collapse;
        min-width: 700px;
    `}
`;

export const UsersTableHead = styled.thead``;

export const UsersTableBody = styled.tbody``;

export const UsersTableHeadItem = styled.th`
    ${({ theme }) => css`
        color: ${theme.colors.text};
        border: 1px solid ${theme.colors.text};
        border-collapse: collapse;
    `}
`;

export const UsersTableHeadRow = styled.tr``;

export const UsersTableBodyRow = styled.tr``;

export const UsersTableBodyItem = styled.td`
    ${({ theme }) => css`
        color: ${theme.colors.text};
        border: 1px solid ${theme.colors.text};
        border-collapse: collapse;
        padding-left: ${theme.padding.small};
    `}
`;

export const PossiblePermsRolesContainer = styled(StyledBaseDiv)`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    ${({ theme }) => css`
        border: 1px solid ${theme.colors.text};
        padding: ${theme.padding.small};
        border-radius: ${theme.borderRadius.medium};
    `}
`;

export const RolesPermsContainer = styled(StyledBaseDiv)`
    display: flex;
    flex-direction: row;
    gap: 5rem;
    ${({ theme }) => css`
        @media screen and (max-width: ${theme.breakpoint}) {
            flex-direction: column;
        }
    `}
`;

export const RolePermRow = styled(StyledBaseDiv)`
    display: flex;
    justify-content: space-between;
`;

export const RolesContainer = styled(StyledBaseDiv)`
    display: flex;
    flex-direction: column;
    min-width: 100px;
`;

export const PermsContainer = styled(StyledBaseDiv)`
    display: flex;
    flex-direction: column;
    min-width: 100px;
`;

export const AddUpdateDeleteHeader = styled(StyledBaseDiv)`
    font-weight: 600;
    text-transform: uppercase;
`;
