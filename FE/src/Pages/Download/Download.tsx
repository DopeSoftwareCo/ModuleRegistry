import { useState } from 'react';
import {
    StyledBaseButton,
    StyledBaseDiv,
    StyledBaseKeyValuePairsContainer,
    StyledBaseKeyValueRow,
    StyledBasePageContiner,
    StyledBaseTextInput,
} from '../../BaseStyledComponents/BaseStyled';
import { DownloadInputs, DownloadLink } from './DownloadStyle';
import { getPackageByIDRequest } from './Requests';
import { PackageFromAPIDownload } from '../../Models/Models';
import { StatusDisplay } from '../../Components/StatusDisplay/StatusDisplay';

const Download = () => {
    const [id, setId] = useState<string>('');
    const [downloadablePackage, setDownloadablePacakge] = useState<PackageFromAPIDownload | undefined>(
        undefined
    );
    const [reqErr, setReqErr] = useState<string | undefined>(undefined);
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);
    const [blobUrl, setBlobUrl] = useState('');
    const [fileName, setFileName] = useState('');

    const makeRequest = async () => {
        const result = await getPackageByIDRequest(
            id,
            (error) => setReqErr(error),
            (blobUrl) => setBlobUrl(blobUrl),
            (fileName) => setFileName(fileName)
        );
        setDownloadablePacakge(result);
    };

    return (
        <StyledBasePageContiner>
            <DownloadInputs>
                <StyledBaseTextInput placeholder="ID" onChange={(e) => setId(e.target.value)} />
                <StyledBaseButton data-testid="download-search-button" onClick={makeRequest}>
                    Get Package
                </StyledBaseButton>
            </DownloadInputs>
            <StatusDisplay
                err={reqErr}
                setErr={setReqErr}
                successMessage={successMessage}
                setSuccess={setSuccessMessage}
            />
            {downloadablePackage && (
                <StyledBaseKeyValuePairsContainer>
                    {downloadablePackage.metadata &&
                        Object.entries(downloadablePackage.metadata).map(([key, value], idx) => (
                            <StyledBaseKeyValueRow key={idx}>
                                <StyledBaseDiv data-testid={key}>{key}</StyledBaseDiv>
                                <StyledBaseDiv>{value}</StyledBaseDiv>
                            </StyledBaseKeyValueRow>
                        ))}
                </StyledBaseKeyValuePairsContainer>
            )}
            {downloadablePackage && (
                <DownloadLink
                    href={blobUrl}
                    target="blank"
                    download={fileName}
                >{`Click here to download: ${fileName}`}</DownloadLink>
            )}
        </StyledBasePageContiner>
    );
};

export default Download;
