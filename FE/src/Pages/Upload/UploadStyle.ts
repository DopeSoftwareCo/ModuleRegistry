import styled from 'styled-components';
import { StyledBaseButton, StyledBaseDiv } from '../../BaseStyledComponents/BaseStyled';

export const FileUploadContainer = styled(StyledBaseDiv)`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const HiddenFileInput = styled.input.attrs({ type: 'file' })`
    display: none;
`;

export const FileInputButton = styled(StyledBaseButton)`
    max-width: 200px;
`;

export const ButtonCheckContainer = styled(StyledBaseDiv)`
    display: flex;
    gap: 1rem;
`;

export const DebloatCheck = styled.input.attrs({ type: 'checkbox' })``;

export const FileNameDisplay = styled(StyledBaseDiv)``;
