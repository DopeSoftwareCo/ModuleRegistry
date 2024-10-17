import styled from 'styled-components';
import { StyledBaseCard, StyledBaseDiv } from '../../BaseStyledComponents/BaseStyled';

//named styled components for all incase different styling is needed later

export const PackageField = styled(StyledBaseDiv)``;

export const PackageFieldRow = styled(StyledBaseDiv)``;

export const PackageFieldKey = styled(PackageField)``;

export const PackageFieldValue = styled(PackageField)``;

export const PackageContainer = styled(StyledBaseCard)``;

export const PackageHeader = styled(StyledBaseDiv)`
    display: flex;
    border-bottom: 1px solid red;
`;

export const PackageBody = styled(StyledBaseDiv)`
    display: flex;
    flex-direction: column;
`;

export const PackageRatingsContainer = styled(StyledBaseDiv)`
    display: flex;
    flex-direction: column;
`;

export const PackageID = styled(PackageField)``;

export const PackageName = styled(PackageField)``;

export const PackageTitle = styled(PackageField)``;

export const PackageUploader = styled(PackageField)``;
export const PackageVersion = styled(PackageField)``;
