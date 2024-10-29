import { useRef, useState } from 'react';
import { StyledBasePageContiner } from '../../BaseStyledComponents/BaseStyled';
import {
    ButtonCheckContainer,
    DebloatCheck,
    FileInputButton,
    FileNameDisplay,
    FileUploadContainer,
    HiddenFileInput,
} from './UploadStyle';
import { ErrorDisplay } from '../../Components/ErrorDisplay/ErrorDisplay';
import { uploadFile } from './Requests';

const Upload = () => {
    const [fileName, setFileName] = useState('');
    const [err, setErr] = useState<undefined | string>(undefined);
    const [debloat, setDebloat] = useState(false);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleButtonClick = () => {
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
                        await uploadFile(base64, debloat, (error) => setErr(error));
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
                <HiddenFileInput ref={fileInputRef} onChange={handleFileChange} />
                <ButtonCheckContainer>
                    <FileInputButton onClick={handleButtonClick}>Upload File</FileInputButton>
                    <DebloatCheck onChange={handleCheckChange} />
                    debloat
                </ButtonCheckContainer>
                <FileNameDisplay>{fileName}</FileNameDisplay>
                <ErrorDisplay err={err} setErr={setErr} />
            </FileUploadContainer>
        </StyledBasePageContiner>
    );
};

export default Upload;
