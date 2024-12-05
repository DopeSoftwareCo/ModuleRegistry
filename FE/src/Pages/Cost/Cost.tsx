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
                {costData && (
                    <StyledBaseKeyValueRow>
                        <CostLabel aria-label="Standalone cost label" data-testid="standalone-cost">
                            Standalone Cost
                        </CostLabel>
                        <CostValue aria-label="Standalone cost value">{costData.standaloneCost} MB</CostValue>
                    </StyledBaseKeyValueRow>
                )}
                {costData && includeDependencies && (
                    <StyledBaseKeyValueRow>
                        <CostLabel aria-label="Totalcost label" data-testid="total-cost">
                            Total Cost
                        </CostLabel>
                        <CostValue aria-label="Total cost value">{costData.totalCost} MB</CostValue>
                    </StyledBaseKeyValueRow>
                )}
            </StyledBaseKeyValuePairsContainer>
        </StyledBasePageContiner>
    );
};

export default Cost;
