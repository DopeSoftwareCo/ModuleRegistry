import { GeneralConfig } from '../../Config/config';
import { PackageRatingFromAPI } from '../../Models/Models';

export const ratingsRequest = async (id: string): Promise<PackageRatingFromAPI> => {
    const response = await fetch(`${GeneralConfig.BACKEND_URL}package/${id}/rate`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `${localStorage.getItem('token')}`,
        },
    });
    const p: PackageRatingFromAPI = await response.json();
    return p;
};
