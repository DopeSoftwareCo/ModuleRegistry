import { useRef, useState } from 'react';
import {
    StyledBaseButton,
    StyledBasePageContiner,
    StyledBaseTextInput,
} from '../../BaseStyledComponents/BaseStyled';
import {
    DebloatCheck,
    DebloatCheckTextRow,
    FileInputButton,
    FileNameDisplay,
    FileUploadContainer,
    HiddenFileInput,
    InputRow,
} from './UploadStyle';
import { uploadFile } from './Requests';
import { StatusDisplay } from '../../Components/StatusDisplay/StatusDisplay';

const Upload = () => {
    const [fileName, setFileName] = useState('');
    const [err, setErr] = useState<undefined | string>(undefined);
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);
    const [debloat, setDebloat] = useState(false);
    const [base64, setBase64] = useState<undefined | string>(undefined);
    const [url, setUrl] = useState<undefined | string>(undefined);
    const [jsProgram, setJsProgram] = useState('');
    const [name, setName] = useState('');

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleChooseClick = () => {
        fileInputRef.current?.click();
    };

    const handleUploadClick = async () => {
        await uploadFile(
            debloat,
            (error) => setErr(error),
            (message) => setSuccessMessage(message),
            jsProgram,
            name,
            base64,
            url
        );
    };

    const handleCheckChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target) {
            setDebloat(event.target.checked);
        }
    };

    const handleClearClick = () => {
        setFileName('');
        setDebloat(false);
        setBase64(undefined);
        setUrl(undefined);
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const file = event.target.files[0];
            if (file) {
                setFileName(file.name);
                const reader = new FileReader();
                reader.onload = async () => {
                    const base64 = reader.result;
                    if (typeof base64 === 'string') {
                        setBase64(base64);
                    }
                };
                reader.onerror = () => {
                    setErr('Error in file reader.');
                };
                reader.readAsDataURL(file);
            }
        }
    };
    return (
        <StyledBasePageContiner>
            <FileUploadContainer>
                <HiddenFileInput
                    aria-label="Hidden file upload ref"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                />
                <InputRow>
                    <StyledBaseTextInput
                        aria-label="URL Input"
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="URL"
                    />
                    <StyledBaseTextInput
                        aria-label="NAME input"
                        onChange={(e) => setName(e.target.value)}
                        placeholder="NAME"
                    />
                </InputRow>
                <InputRow>
                    <StyledBaseTextInput
                        onChange={(e) => setJsProgram(e.target.value)}
                        placeholder="JSProgram"
                        aria-label="JSProgram input"
                    />
                </InputRow>
                <InputRow>
                    <FileInputButton aria-label="Add file button" onClick={handleChooseClick}>
                        File
                    </FileInputButton>
                    <DebloatCheckTextRow>
                        <DebloatCheck aria-label="Debloat checkbox" onChange={handleCheckChange} />
                        debloat
                    </DebloatCheckTextRow>
                </InputRow>
                <FileNameDisplay aria-label="Filename label">{fileName}</FileNameDisplay>
                <StyledBaseButton aria-label="clear form button" onClick={handleClearClick}>
                    Clear
                </StyledBaseButton>
                <StyledBaseButton
                    aria-label="submit upload request"
                    data-testid="upload-button"
                    onClick={handleUploadClick}
                >
                    Upload
                </StyledBaseButton>
                <StatusDisplay
                    err={err}
                    setErr={setErr}
                    successMessage={successMessage}
                    setSuccess={setSuccessMessage}
                />
            </FileUploadContainer>
        </StyledBasePageContiner>
    );
};

export default Upload;
