import { useState } from 'react';
import { StyledBasePageContiner } from '../../BaseStyledComponents/BaseStyled';
import {
    Inputs,
    RatingIDInput,
    RatingName,
    RatingRequestButton,
    RatingRow,
    RatingValue,
} from './RatingStyle';
import { PackageRatingFromAPI } from '../../Models/Models';
import { ratingsRequest } from './Requests';
import { ErrorDisplay } from '../../Components/ErrorDisplay/ErrorDisplay';

const Rating = () => {
    const [ratings, setRatings] = useState<undefined | PackageRatingFromAPI>(undefined);
    const [searchID, setSearchID] = useState('');
    const [err, setErr] = useState<string | undefined>(undefined);

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
                    onChange={(e) => {
                        setSearchID(e.target.value);
                    }}
                />
                <RatingRequestButton data-testid="ratings-request-button" onClick={makeRequest}>
                    Get Rating
                </RatingRequestButton>
            </Inputs>
            <ErrorDisplay err={err} setErr={setErr} />
            {ratings &&
                Object.entries(ratings).map(([ratingName, ratingValue], idx) => (
                    <RatingRow key={idx}>
                        <RatingName data-testid={ratingName}>{ratingName}</RatingName>
                        <RatingValue>{ratingValue}</RatingValue>
                    </RatingRow>
                ))}
        </StyledBasePageContiner>
    );
};

export default Rating;
