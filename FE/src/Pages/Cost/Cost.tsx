import { useState } from 'react';
import {
    StyledBasePageContiner,
    StyledBaseKeyValuePairsContainer,
    StyledBaseKeyValueRow,
} from '../../BaseStyledComponents/BaseStyled';
import { Inputs, IDContainer, CostIDInput, CostRequestButton, CostLabel, CostValue, CheckboxContainer } from './CostStyle';
import { PackageCost } from '../../../../BE/src/Types/Models';
import { costRequest } from './Requests';
import { StatusDisplay } from '../../Components/StatusDisplay/StatusDisplay';

const Cost = () => {
    const [costData, setCostData] = useState<PackageCost | undefined>(undefined);
    const [searchID, setSearchID] = useState('');
    const [includeDependencies, setIncludeDependencies] = useState(false);
    const [err, setErr] = useState<string | undefined>(undefined);
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);

    const makeRequest = async () => {
        const costFromRequest = await costRequest(searchID, includeDependencies, (err) => {
            setErr(err);
        });
        setCostData(costFromRequest);
    };

    return (
        <StyledBasePageContiner>
            <Inputs>
                <IDContainer>
                    <CostIDInput
                        placeholder="ID"
                        onChange={(e) => {
                            setSearchID(e.target.value);
                        }}
                    />
                    <CheckboxContainer>
                        <label>
                            <input
                                type="checkbox"
                                checked={includeDependencies}
                                onChange={(e) => setIncludeDependencies(e.target.checked)}
                            />
                            Include Dependencies
                        </label>
                    </CheckboxContainer>
                </IDContainer>
                <CostRequestButton data-testid="cost-request-button" onClick={makeRequest}>
                    Get Cost
                </CostRequestButton>
            </Inputs>
            <StatusDisplay
                err={err}
                setErr={setErr}
                successMessage={successMessage}
                setSuccess={setSuccessMessage}
            />
            <StyledBaseKeyValuePairsContainer>
            {costData && (
                <>
                    <StyledBaseKeyValueRow>
                        <CostLabel data-testid="standalone-cost">Standalone Cost</CostLabel>
                        <CostValue>{costData.standaloneCost} MB</CostValue>
                    </StyledBaseKeyValueRow>
                    {includeDependencies && (
                        <StyledBaseKeyValueRow>
                            <CostLabel data-testid="total-cost">Total Cost</CostLabel>
                            <CostValue>{costData.totalCost} MB</CostValue>
                        </StyledBaseKeyValueRow>
                    )}
                </>
            )}
            </StyledBaseKeyValuePairsContainer>
        </StyledBasePageContiner>
    );
};

export default Cost;
