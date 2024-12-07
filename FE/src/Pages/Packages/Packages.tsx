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
    RequestRow,
    RemoveButton,
    ButtonsRow,
} from './PackagesStyle';
import { PackageMetaDataFromAPI } from '../../Models/Models';
import { getPackagesRequest } from './Requests';
import { StatusDisplay } from '../../Components/StatusDisplay/StatusDisplay';

const Packages = () => {
    const [requests, setRequests] = useState<{ Name: string; Version?: string }[]>([
        { Name: '', Version: '' },
    ]);
    const [packages, setPackages] = useState<PackageMetaDataFromAPI[]>([]);
    const [err, setErr] = useState<string | undefined>(undefined);
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);

    // Adds a new request row. Each row contains a name and version field.
    const handleAddRequest = () => {
        setRequests((prev) => [...prev, { Name: '', Version: '' }]);
    };

    // Updates the name or version field for a specific request.
    const handleUpdateRequest = (index: number, field: 'Name' | 'Version', value: string) => {
        setRequests((prev) =>
            prev.map((req, i) => (i === index ? { ...req, [field]: value } : req))
        );
    };

    // Handle the deletion of a request using its index.
    const handleDeleteRequest = (index: number) => {
        setRequests((prev) => prev.filter((_, i) => i !== index));
    };

    // Handle the logic behind the user making a request.
    const makeRequest = async () => {
        // Clear the previous results/messages when making new requests.
        setPackages([]);
        setErr(undefined);
        setSuccessMessage(undefined);

        // Filter out empty requests.
        const filteredRequests = requests
            .filter((req) => req.Name.trim())
            .map(({ Name, Version }) => (Version ? { Name, Version } : { Name }));

        // If the request length is 0, tell the user to give us something.
        if (filteredRequests.length === 0) {
            setErr('Please provide at least one package name.');
            return;
        }

        const result = await getPackagesRequest(filteredRequests, (err) => {
            setErr(err);
        });

        if (result) {
            setPackages(result.data);
            setSuccessMessage('Packages fetched successfully!');
        }
    };

    return (
        <StyledBasePageContiner>
            <h2>Add Requests for Package Version Fetch</h2>
            <PackagesInputs>
                {requests.map((req, index) => (
                    <RequestRow key={index}>
                        <PackagesInput
                            placeholder="Package Name"
                            value={req.Name}
                            onChange={(e) => handleUpdateRequest(index, 'Name', e.target.value)}
                        />
                        <PackagesInput
                            placeholder="Version (optional)"
                            value={req.Version || ''}
                            onChange={(e) => handleUpdateRequest(index, 'Version', e.target.value)}
                        />
                        {requests.length > 1 && (
                            <RemoveButton onClick={() => handleDeleteRequest(index)}>
                                Remove
                            </RemoveButton>
                        )}
                    </RequestRow>
                ))}
            </PackagesInputs>
            <ButtonsRow>
                <PackagesRequestButton onClick={handleAddRequest}>Add Request</PackagesRequestButton>
                <PackagesRequestButton onClick={makeRequest}>Find Packages</PackagesRequestButton>
            </ButtonsRow>
            <StatusDisplay
                err={err}
                setErr={setErr}
                successMessage={successMessage}
                setSuccess={setSuccessMessage}
            />
            <StyledBaseKeyValuePairsContainer>
                {packages.map((pack, idx) => (
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
