import { useState } from 'react';
import {
    StyledBaseKeyValuePairsContainer,
    StyledBaseKeyValueRow,
    StyledBasePageContiner,
} from '../../BaseStyledComponents/BaseStyled';
import {
    PackagesInputs,
    PackagesInput,
    PackagesRequestButton,
    PackagesResultName,
    PackagesResultVersion,
} from './PackagesStyle';
import { PackageMetaDataFromAPI } from '../../Models/Models';
import { getPackagesRequest } from './Requests';
import { StatusDisplay } from '../../Components/StatusDisplay/StatusDisplay';

const Packages = () => {
    const [packages, setPackages] = useState<undefined | PackageMetaDataFromAPI[]>(undefined);
    const [queryString, setQueryString] = useState(''); // Input for version query
    const [packageName, setPackageName] = useState(''); // Input for package name
    const [err, setErr] = useState<string | undefined>(undefined);
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);
    const makeRequest = async () => {
        const result = await getPackagesRequest(queryString, packageName, (err) => {
            setErr(err);
        });
        if (result) {
            setPackages(result.data);
        }
    };

    return (
        <StyledBasePageContiner>
            <PackagesInputs>
                <PackagesInput placeholder="Package Name" onChange={(e) => setPackageName(e.target.value)}/>
                <PackagesInput placeholder="Version Query" onChange={(e) => setQueryString(e.target.value)}/>
                <PackagesRequestButton data-testid="packages-request-button" onClick={makeRequest}>
                    Find Packages
                </PackagesRequestButton>
            </PackagesInputs>
            <StatusDisplay
                err={err}
                setErr={setErr}
                successMessage={successMessage}
                setSuccess={setSuccessMessage}
            />
            <StyledBaseKeyValuePairsContainer>
                {packages &&
                    packages.map((pack, idx) => (
                        <StyledBaseKeyValueRow key={idx} data-testid={pack.ID}>
                            <PackagesResultName>{pack.Name}</PackagesResultName>
                            <PackagesResultVersion>{pack.Version}</PackagesResultVersion>
                        </StyledBaseKeyValueRow>
                    ))}
            </StyledBaseKeyValuePairsContainer>
        </StyledBasePageContiner>
    );
};

export default Packages;
