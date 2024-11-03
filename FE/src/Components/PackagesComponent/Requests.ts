import { GeneralConfig } from '../../Config/config';
import { DBPackagesFromAPI } from '../../Models/Models';
import { PackageComponentProps } from '../PackageComponent/PackageComponent';

const dateToRecentString = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);

    const intervals = {
        year: 31536000,
        month: 2592000,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1,
    };

    for (const [key, value] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / value);
        if (interval >= 1) {
            return `${interval} ${key}${interval > 1 ? 's' : ''} ago`;
        }
    }

    return 'just now';
};

const massageDBPackages = (packages: DBPackagesFromAPI): PackageComponentProps[] =>
    packages.packages.map((p) => ({
        id: p._id,
        name: p.metadata.Name,
        version: p.metadata.Version,
        uploader: p.metadata.Uploader,
        updateDate: dateToRecentString(p.updatedAt),
        url: p.repoUrl,
    }));

export const getAllPackagesRequest = async (
    errorSetter: (error: string) => void
): Promise<PackageComponentProps[] | undefined> => {
    try {
        const response = await fetch(`${GeneralConfig.BACKEND_URL}test`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                test: 'test',
            }),
        });
        const responseJson = await response.json();
        return massageDBPackages(responseJson);
    } catch (err) {
        if (err instanceof Error) {
            errorSetter(err.message);
        } else {
            errorSetter('An unknown error occured in getAllPackagesRequest...');
        }
    }
};
