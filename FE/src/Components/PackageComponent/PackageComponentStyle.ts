import styled, { css } from 'styled-components';
import { StyledBaseA, StyledBaseDiv } from '../../BaseStyledComponents/BaseStyled';

export const PackageContainer = styled(StyledBaseDiv)`
    display: flex;
    flex-direction: column;
    border-top: 1px solid red;
    min-width: 50vw;
    gap: 0.5rem;
    ${({ theme }) => css`
        padding: ${theme.padding.small};
        border-top: 1px solid ${theme.colors.text};
        @media screen and (max-width: ${theme.breakpoint}) {
            min-width: 90vw;
        }
    `}
`;

export const PackageID = styled(StyledBaseDiv)`
    background: transparent;
    ${({ theme }) => css`
        font-size: ${theme.fontSizes.xSmall};
        top: -${theme.fontSizes.small};
    `}
`;

export const PackageNameVersionContainer = styled(StyledBaseDiv)`
    display: flex;
    gap: 1rem;
`;

export const PackageNVUrlContainer = styled(StyledBaseDiv)`
    display: flex;
    justify-content: space-between;
`;

export const UploadInformationContainer = styled(StyledBaseDiv)`
    display: flex;
    gap: 1rem;
`;

export const PackageName = styled(StyledBaseDiv)`
    ${({ theme }) => css`
        color: ${theme.colors.accentOrange};
    `}
`;

export const PackageVersion = styled(StyledBaseDiv)``;

export const PackageUploader = styled(StyledBaseDiv)``;

export const PackageUpdateDate = styled(StyledBaseDiv)``;

export const PackageUrl = styled(StyledBaseA)`
    ${({ theme }) => css`
        color: ${theme.colors.skyBlue};
    `}
`;
