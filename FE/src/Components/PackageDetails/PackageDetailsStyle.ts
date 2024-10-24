import styled, { keyframes } from 'styled-components';
import { StyledBaseDiv } from '../../BaseStyledComponents/BaseStyled';

export const PackageField = styled(StyledBaseDiv)``;

export const PackageFieldRow = styled(StyledBaseDiv)`
    display: flex;
    width: 100%;
    justify-content: space-between;
`;

export const PackageFieldKey = styled(PackageField)``;

export const PackageFieldValue = styled(PackageField)``;

const Frames = keyframes`
    0%{
        opacity: 0;
    }100%{
        opacity: 1;
    }
`;

export const PackageDetailsContainer = styled(StyledBaseDiv)`
    display: flex;
    flex-direction: column;
    padding-top: 0.15rem;
    animation: ${Frames} ${({ theme }) => theme.animationTime.medium};
    animation-fill-mode: forwards;
`;
