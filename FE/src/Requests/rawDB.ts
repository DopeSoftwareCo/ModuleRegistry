import { GeneralConfig } from '../Config/config';
import { DBPackagesFromAPI, Packages } from '../Models/Models';

const getRawDBPackagesRequest = async (): Promise<DBPackagesFromAPI> => {
    const response = await fetch(`${GeneralConfig.BACKEND_URL}test`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ test: 'test' }),
    });
    const packages: DBPackagesFromAPI = await response.json();
    return packages;
};

const getTimeAgoString = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const intervals = {
        year: 365 * 24 * 60 * 60,
        month: 30 * 24 * 60 * 60,
        day: 24 * 60 * 60,
        hour: 60 * 60,
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

const mapRawDBPackagesResponse = (rawPackages: DBPackagesFromAPI): Packages =>
    rawPackages.packages.map((dbPackage) => ({
        _id: dbPackage._id,
        name: dbPackage.metaData.Name,
        version: dbPackage.metaData.Version,
        ratings: {
            BusFactor: dbPackage.score_busFactor,
            Correctness: dbPackage.score_correctness,
            RampUp: dbPackage.rampup_score,
            ResponsiveMaintainer: dbPackage.score_responsiveMaintainer,
            LicenseScore: dbPackage.score_license,
            GoodPinningPractice: dbPackage.score_goodPinningPractice,
            PullRequest: dbPackage.score_pullrequest,
            NetScore: dbPackage.netscore,
        },
        repoUrl: dbPackage.repoUrl,
        uploader: dbPackage.uploader,
        visibility: dbPackage.visibility,
        isExternal: dbPackage.isExternal,
        safety: dbPackage.safety,
        secrecyEnabled: dbPackage.secrecyEnabled,
        license: dbPackage.license,
        updatedAt: getTimeAgoString(dbPackage.updatedAt),
    }));

export const getRawDBPackages = async (): Promise<Packages> => {
    const rawPackages = await getRawDBPackagesRequest();
    return mapRawDBPackagesResponse(rawPackages);
};
