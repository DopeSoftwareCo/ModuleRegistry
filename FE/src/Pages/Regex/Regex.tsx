import { useState } from 'react';
import { StyledBasePageContiner } from '../../BaseStyledComponents/BaseStyled';
import {
    RegexInput,
    RegexInputs,
    RegexPackageName,
    RegexPackageRow,
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
                <RegexInput onChange={(e) => setRegexSearchString(e.target.value)} />
                <RegexSearchButton data-testid="regex-search-button" onClick={makeRequest}>
                    Submit
                </RegexSearchButton>
            </RegexInputs>
            <ErrorDisplay err={reqErr} setErr={setReqErr} />
            {regexPackages &&
                regexPackages.map((rPack, idx) => (
                    <RegexPackageRow key={idx} data-testid={rPack.Name}>
                        <RegexPackageName>{rPack.Name}</RegexPackageName>
                        <RegexPackageVersion>{rPack.Version}</RegexPackageVersion>
                    </RegexPackageRow>
                ))}
        </StyledBasePageContiner>
    );
};

export default Regex;
