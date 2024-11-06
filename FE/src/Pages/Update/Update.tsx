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
} from '../Upload/UploadStyle';
import { StatusDisplay } from '../../Components/StatusDisplay/StatusDisplay';
import { updateWithPackage } from './Requests';

const Update = () => {
    const [fileName, setFileName] = useState('');
    const [base64, setBase64] = useState<undefined | string>(undefined);
    const [debloat, setDebloat] = useState(false);
    const [err, setErr] = useState<undefined | string>(undefined);
    const [url, setUrl] = useState<undefined | string>(undefined);
    const [jsProgram, setJsProgram] = useState<string | undefined>(undefined);
    const [name, setName] = useState<string | undefined>(undefined);
    const [version, setVersion] = useState<string | undefined>(undefined);
    const [id, setID] = useState<string | undefined>(undefined);
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleUploadClick = async () => {
        await updateWithPackage(
            debloat,
            (error) => setErr(error),
            (message) => setSuccessMessage(message),
            name,
            version,
            id,
            jsProgram,
            base64,
            url
        );
    };

    const handleChooseClick = () => {
        fileInputRef.current?.click();
    };

    const handleCheckChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target) {
            setDebloat(event.target.checked);
        }
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

    const handleClearClick = () => {
        setFileName('');
        setDebloat(false);
        setBase64(undefined);
        setUrl(undefined);
        setName(undefined);
        setJsProgram(undefined);
        setVersion(undefined);
    };
    return (
        <StyledBasePageContiner>
            <FileUploadContainer>
                <HiddenFileInput ref={fileInputRef} onChange={handleFileChange} />
                <StyledBaseTextInput placeholder="ID" onChange={(e) => setID(e.target.value)} />
                <InputRow>
                    <StyledBaseTextInput onChange={(e) => setUrl(e.target.value)} placeholder="URL" />
                    <StyledBaseTextInput
                        onChange={(e) => setJsProgram(e.target.value)}
                        placeholder="JSProgram"
                    />
                </InputRow>
                <InputRow>
                    <StyledBaseTextInput placeholder="Name" onChange={(e) => setName(e.target.value)} />
                    <StyledBaseTextInput placeholder="Version" onChange={(e) => setVersion(e.target.value)} />
                </InputRow>
                <InputRow>
                    <FileInputButton onClick={handleChooseClick}>File</FileInputButton>
                    <DebloatCheckTextRow>
                        <DebloatCheck onChange={handleCheckChange} />
                        debloat
                    </DebloatCheckTextRow>
                </InputRow>
                <FileNameDisplay>{fileName}</FileNameDisplay>
                <StyledBaseButton onClick={handleClearClick}>Clear</StyledBaseButton>
                <StyledBaseButton data-testid="update-button" onClick={handleUploadClick}>
                    Update
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

export default Update;
