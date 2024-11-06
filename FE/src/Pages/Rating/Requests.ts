import { GeneralConfig } from '../../Config/config';
import { PackageRatingFromAPI } from '../../Models/Models';

const massageResult = (rating: PackageRatingFromAPI, decimals: number = 2): PackageRatingFromAPI => {
    const roundedRating: PackageRatingFromAPI = { ...rating };
    for (const key in roundedRating) {
        if (typeof roundedRating[key as keyof typeof roundedRating] === 'number') {
            roundedRating[key as keyof typeof roundedRating] = parseFloat(
                roundedRating[key as keyof typeof roundedRating].toFixed(decimals)
            );
        }
    }
    return roundedRating;
};

export const ratingsRequest = async (
    id: string,
    errorSetter: (error: string) => void
): Promise<PackageRatingFromAPI | undefined> => {
    try {
        const response = await fetch(`${GeneralConfig.BACKEND_URL}package/${id}/rate`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${localStorage.getItem('token')}`,
            },
        });
        if (!response.ok) {
            const responseText = await response.text();
            errorSetter(responseText);
            return undefined;
        }
        const p: PackageRatingFromAPI = await response.json();
        return massageResult(p);
    } catch (err) {
        if (err instanceof Error) {
            errorSetter(err.message);
        } else errorSetter('an unknown error occured in ratingsRequest');
    }
};
