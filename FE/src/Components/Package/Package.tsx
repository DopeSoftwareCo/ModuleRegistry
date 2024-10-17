import { Package } from '../../Models/Models';
import {
    PackageBody,
    PackageContainer,
    PackageFieldKey,
    PackageFieldRow,
    PackageFieldValue,
    PackageHeader,
    PackageID,
    PackageName,
    PackageRatingsContainer,
    PackageUploader,
    PackageVersion,
} from './PackageStyle';

const DefaultPackageProps: { packageProp: Package } = {
    packageProp: {
        _id: '10df90dfadf-w9n9d-0w89088972',
        name: 'Default Package Name',
        version: '1.2.3',
        ratings: {
            BusFactor: 0.0,
            Correctness: 0.01,
            RampUp: 0.02,
            ResponsiveMaintainer: 0.03,
            LicenseScore: 0.04,
            GoodPinningPractice: 0.05,
            PullRequest: 0.06,
            NetScore: 0.07,
        },
        repoUrl: 'https://www.github.com/default/url',
        uploader: 'default uploader',
        visibility: 'secret',
        isExternal: true,
        safety: 'vetted',
        secrecyEnabled: false,
        license: 'MIT',
    },
};

interface PackageComponentProps {
    packageProp: Package;
}
export const PackageComponent = ({
    packageProp = DefaultPackageProps.packageProp,
}: PackageComponentProps) => {
    return (
        <PackageContainer>
            <PackageID>{packageProp._id}</PackageID>
            <PackageHeader>
                <PackageName>{packageProp.name}</PackageName>
                <PackageVersion>{packageProp.version}</PackageVersion>
                <PackageUploader>{packageProp.uploader}</PackageUploader>
            </PackageHeader>
            <PackageBody>
                <PackageRatingsContainer>
                    {Object.entries(packageProp.ratings).map(([ratingName, ratingValue]) => (
                        <PackageFieldRow>
                            <PackageFieldKey>{ratingName}</PackageFieldKey>
                            <PackageFieldValue>{ratingValue}</PackageFieldValue>
                        </PackageFieldRow>
                    ))}
                </PackageRatingsContainer>
            </PackageBody>
        </PackageContainer>
    );
};
