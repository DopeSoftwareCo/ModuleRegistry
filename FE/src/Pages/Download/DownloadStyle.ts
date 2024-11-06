import styled, { css } from 'styled-components';
import { StyledBaseA, StyledBaseDiv } from '../../BaseStyledComponents/BaseStyled';

export const DownloadInputs = styled(StyledBaseDiv)`
    display: flex;
    gap: 1rem;
`;

export const DownloadLink = styled(StyledBaseA)`
    ${({ theme }) => css`
        color: ${theme.colors.skyBlue};
    `}
`;
