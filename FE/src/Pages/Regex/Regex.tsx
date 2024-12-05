import { useState } from 'react';
import {
    StyledBaseKeyValuePairsContainer,
    StyledBaseKeyValueRow,
    StyledBasePageContiner,
} from '../../BaseStyledComponents/BaseStyled';
import {
    RegexInput,
    RegexInputs,
    RegexPackageName,
    RegexPackageVersion,
    RegexSearchButton,
} from './RegexStyle';
import { RegexPackagesFromAPI } from '../../Models/Models';
import { getPackagesViaRegexRequest } from './Requests';
import { StatusDisplay } from '../../Components/StatusDisplay/StatusDisplay';

const Regex = () => {
    const [regexPackages, setRegexPackages] = useState<undefined | RegexPackagesFromAPI>(undefined);
    const [regexSearchString, setRegexSearchString] = useState('');
    const [reqErr, setReqErr] = useState<string | undefined>(undefined);
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);

    const makeRequest = async () => {
        const regexPacakgesFromRequest = await getPackagesViaRegexRequest(regexSearchString, (err) =>
            setReqErr(err)
        );
        setRegexPackages(regexPacakgesFromRequest);
    };

    return (
        <StyledBasePageContiner>
            <RegexInputs>
                <RegexInput
                    aria-label="Regex string input"
                    placeholder="REGEX"
                    onChange={(e) => setRegexSearchString(e.target.value)}
                />
                <RegexSearchButton
                    aria-label="Find packages fitting regex"
                    data-testid="regex-search-button"
                    onClick={makeRequest}
                >
                    Find Packages
                </RegexSearchButton>
            </RegexInputs>
            <StatusDisplay
                err={reqErr}
                setErr={setReqErr}
                successMessage={successMessage}
                setSuccess={setSuccessMessage}
            />
            <StyledBaseKeyValuePairsContainer>
                {regexPackages &&
                    regexPackages.map((rPack, idx) => (
                        <StyledBaseKeyValueRow key={idx} data-testid={rPack.Name}>
                            <RegexPackageName>{rPack.Name}</RegexPackageName>
                            <RegexPackageVersion>{rPack.Version}</RegexPackageVersion>
                        </StyledBaseKeyValueRow>
                    ))}
            </StyledBaseKeyValuePairsContainer>
        </StyledBasePageContiner>
    );
};

export default Regex;
