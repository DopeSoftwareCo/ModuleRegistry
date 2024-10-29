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

const Rating = () => {
    const [ratings, setRatings] = useState<undefined | PackageRatingFromAPI>(undefined);
    const [searchID, setSearchID] = useState('');
    const makeRequest = async () => {
        const ratingsFromRequest = await ratingsRequest(searchID);
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
