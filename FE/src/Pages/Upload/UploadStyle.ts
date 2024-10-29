import styled, { css } from 'styled-components';
import { StyledBaseButton, StyledBaseDiv } from '../../BaseStyledComponents/BaseStyled';

export const FileUploadContainer = styled(StyledBaseDiv)`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
`;

export const HiddenFileInput = styled.input.attrs({ type: 'file' })`
    display: none;
`;

export const FileInputButton = styled(StyledBaseButton)`
    max-width: 200px;
`;

export const InputRow = styled(StyledBaseDiv)`
    display: flex;
    gap: 1rem;
    ${({ theme }) => css`
        @media screen and (max-width: ${theme.breakpoint}) {
            flex-direction: column;
            align-items: center;
        }
    `}
`;

export const DebloatCheckTextRow = styled(StyledBaseDiv)`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    text-transform: uppercase;
`;

export const DebloatCheck = styled.input.attrs({ type: 'checkbox' })``;

export const FileNameDisplay = styled(StyledBaseDiv)``;
