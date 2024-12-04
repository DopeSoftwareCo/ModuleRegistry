import { useState } from 'react';
import {
    StyledBaseKeyValuePairsContainer,
    StyledBaseKeyValueRow,
    StyledBasePageContiner,
} from '../../BaseStyledComponents/BaseStyled';
import { Inputs, RatingIDInput, RatingName, RatingRequestButton, RatingValue } from './RatingStyle';
import { PackageRatingFromAPI } from '../../Models/Models';
import { ratingsRequest } from './Requests';
import { StatusDisplay } from '../../Components/StatusDisplay/StatusDisplay';

const Rating = () => {
    const [ratings, setRatings] = useState<undefined | PackageRatingFromAPI>(undefined);
    const [searchID, setSearchID] = useState('');
    const [err, setErr] = useState<string | undefined>(undefined);
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);

    const makeRequest = async () => {
        const ratingsFromRequest = await ratingsRequest(searchID, (err) => {
            setErr(err);
        });
        setRatings(ratingsFromRequest);
    };
    return (
        <StyledBasePageContiner>
            <Inputs>
                <RatingIDInput
                    placeholder="ID"
                    onChange={(e) => {
                        setSearchID(e.target.value);
                    }}
                    aria-label="ID Input"
                />
                <RatingRequestButton
                    aria-label="Submit rating button"
                    data-testid="ratings-request-button"
                    onClick={makeRequest}
                >
                    Get Rating
                </RatingRequestButton>
            </Inputs>
            <StatusDisplay
                err={err}
                setErr={setErr}
                successMessage={successMessage}
                setSuccess={setSuccessMessage}
            />
            <StyledBaseKeyValuePairsContainer>
                {ratings &&
                    Object.entries(ratings).map(([ratingName, ratingValue], idx) => (
                        <StyledBaseKeyValueRow key={idx}>
                            <RatingName aria-label={ratingName} data-testid={ratingName}>
                                {ratingName}
                            </RatingName>
                            <RatingValue aria-label={ratingValue}>{ratingValue}</RatingValue>
                        </StyledBaseKeyValueRow>
                    ))}
            </StyledBaseKeyValuePairsContainer>
        </StyledBasePageContiner>
    );
};

export default Rating;
