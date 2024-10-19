import styled, { css } from 'styled-components';
import { StyledBaseDiv } from '../../BaseStyledComponents/BaseStyled';
import { lighten } from 'polished';

//named styled components for all incase different styling is needed later

export const PackageContainer = styled(StyledBaseDiv)`
    position: relative;
    min-width: 80vw;
`;

export const PackageHeader = styled(StyledBaseDiv)`
    display: flex;
    flex-direction: column;
    ${({ theme }) => css`
        border-bottom: 1px solid
            ${theme.colors.background === theme.colors.black
                ? lighten(0.2, theme.colors.background)
                : lighten(0.2, theme.colors.text)};
    `}
`;

export const HeaderFooter = styled(StyledBaseDiv)`
    display: flex;
    justify-content: space-between;
`;

export const PackageVersionInfo = styled(StyledBaseDiv)`
    display: flex;
    gap: 1rem;
`;
export const PackageUpdatedAt = styled(StyledBaseDiv)``;

export const PackageName = styled(StyledBaseDiv)`
    ${({ theme }) => css`
        color: ${theme.colors.accentOrangeOther};
    `}
`;

export const PackageTitle = styled(StyledBaseDiv)``;

export const PackageUploader = styled(StyledBaseDiv)``;
export const PackageVersion = styled(StyledBaseDiv)``;
