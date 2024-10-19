import { Package } from '../../Models/Models';
import {
    HeaderFooter,
    PackageContainer,
    PackageHeader,
    PackageName,
    PackageUpdatedAt,
    PackageUploader,
    PackageVersion,
    PackageVersionInfo,
} from './PackageStyle';
import { BiChevronDown, BiChevronUp } from 'react-icons/bi';
import { useState } from 'react';
import { PackageDetailsComponent } from '../PackageDetails/PackageDetails';
import { StyledHiddenButton } from '../../BaseStyledComponents/BaseStyled';

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
        updatedAt: '33 minutes ago.',
    },
};

interface PackageComponentProps {
    packageProp: Package;
}
export const PackageComponent = ({
    packageProp = DefaultPackageProps.packageProp,
}: PackageComponentProps) => {
    const [showDetails, setShowDetails] = useState(false);
    return (
        <PackageContainer>
            <PackageHeader>
                <PackageName>{packageProp.name}</PackageName>
                <HeaderFooter>
                    <PackageVersionInfo>
                        <PackageUploader>{packageProp.uploader}</PackageUploader>
                        <PackageVersion>published {packageProp.version}</PackageVersion>
                        <PackageUpdatedAt>{packageProp.updatedAt}</PackageUpdatedAt>
                    </PackageVersionInfo>
                    <StyledHiddenButton onClick={() => setShowDetails((state) => !state)}>
                        {showDetails ? <BiChevronUp /> : <BiChevronDown />}
                    </StyledHiddenButton>
                </HeaderFooter>
            </PackageHeader>
            {showDetails && <PackageDetailsComponent packageProp={packageProp} />}
        </PackageContainer>
    );
};
