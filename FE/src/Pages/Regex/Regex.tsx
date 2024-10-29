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
import { ErrorDisplay } from '../../Components/ErrorDisplay/ErrorDisplay';

const Regex = () => {
    const [regexPackages, setRegexPackages] = useState<undefined | RegexPackagesFromAPI>(undefined);
    const [regexSearchString, setRegexSearchString] = useState('');
    const [reqErr, setReqErr] = useState<string | undefined>(undefined);

    const makeRequest = async () => {
        const regexPacakgesFromRequest = await getPackagesViaRegexRequest(regexSearchString, (err) =>
            setReqErr(err)
        );
        setRegexPackages(regexPacakgesFromRequest);
    };

    return (
        <StyledBasePageContiner>
            <RegexInputs>
                <RegexInput placeholder="REGEX" onChange={(e) => setRegexSearchString(e.target.value)} />
                <RegexSearchButton data-testid="regex-search-button" onClick={makeRequest}>
                    Find Packages
                </RegexSearchButton>
            </RegexInputs>
            <ErrorDisplay err={reqErr} setErr={setReqErr} />
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
