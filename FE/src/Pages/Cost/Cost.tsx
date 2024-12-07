import { useState } from 'react';
import {
    StyledBasePageContiner,
    StyledBaseKeyValuePairsContainer,
    StyledBaseKeyValueRow,
} from '../../BaseStyledComponents/BaseStyled';
import {
    Inputs,
    IDContainer,
    CostIDInput,
    CostRequestButton,
    CostLabel,
    CostValue,
    CheckboxContainer,
} from './CostStyle';
import { costRequest } from './Requests';
import { StatusDisplay } from '../../Components/StatusDisplay/StatusDisplay';
import { PackageCostFromAPI } from '../../Models/Models';

const Cost = () => {
    const [costData, setCostData] = useState<PackageCostFromAPI | undefined>(undefined);
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
                        aria-label="ID Input"
                    />
                    <CheckboxContainer>
                        <label>
                            <input
                                type="checkbox"
                                checked={includeDependencies}
                                onChange={(e) => setIncludeDependencies(e.target.checked)}
                                aria-label="Include dependencies checkbox"
                            />
                            Include Dependencies
                        </label>
                    </CheckboxContainer>
                </IDContainer>
                <CostRequestButton
                    aria-label="Submit cost request"
                    data-testid="cost-request-button"
                    onClick={makeRequest}
                >
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
                {costData &&
                    Object.entries(costData).map(([id, costEntry], idx) => (
                        <StyledBaseKeyValuePairsContainer key={idx}>
                            <CostLabel>{id}</CostLabel>
                            <StyledBaseKeyValueRow>
                                <CostLabel aria-label="Standalone cost label" data-testid="standalone-cost">
                                    Standalone
                                </CostLabel>
                                <CostValue aria-label="Standalone cost value">
                                    {costEntry.standaloneCost} MB
                                </CostValue>
                            </StyledBaseKeyValueRow>
                            {includeDependencies && (
                                <StyledBaseKeyValueRow>
                                    <CostLabel aria-label="total cost label" data-testid="total-cost">
                                        Total
                                    </CostLabel>
                                    <CostValue aria-label="total cost value">
                                        {costEntry.totalCost} MB
                                    </CostValue>
                                </StyledBaseKeyValueRow>
                            )}
                        </StyledBaseKeyValuePairsContainer>
                    ))}
            </StyledBaseKeyValuePairsContainer>
        </StyledBasePageContiner>
    );
};

export default Cost;
