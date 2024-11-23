import { StyledBaseDiv } from '../../../BaseStyledComponents/BaseStyled';
import {
    getEnumValue,
    PermissionEnum,
    permissionKeys,
    Role,
    roleKeys,
} from '../../../BETypes/PermissionsRoles';
import {
    PermsContainer,
    PossiblePermsRolesContainer,
    RolePermRow,
    RolesContainer,
    RolesPermsContainer,
} from '../AdminDashStyle';

export const PossiblePermsRoles = () => {
    return (
        <PossiblePermsRolesContainer>
            <StyledBaseDiv>UDS (Upload,Download,Search) 000, 001, 011 etc.</StyledBaseDiv>
            <RolesPermsContainer>
                <RolesContainer>
                    {roleKeys.map((key, idx) => (
                        <RolePermRow key={idx}>
                            <StyledBaseDiv>{key}</StyledBaseDiv>
                            <StyledBaseDiv>{getEnumValue(Role, key)}</StyledBaseDiv>
                        </RolePermRow>
                    ))}
                </RolesContainer>
                <PermsContainer>
                    {permissionKeys.map((key, idx) => (
                        <RolePermRow key={idx}>
                            <StyledBaseDiv>{key}</StyledBaseDiv>
                            <StyledBaseDiv>{getEnumValue(PermissionEnum, key)}</StyledBaseDiv>
                        </RolePermRow>
                    ))}
                </PermsContainer>
            </RolesPermsContainer>
            <StyledBaseDiv>
                Please use the number on the right that corresponds with the role/permission you would like to
                add/modify.
            </StyledBaseDiv>
        </PossiblePermsRolesContainer>
    );
};
