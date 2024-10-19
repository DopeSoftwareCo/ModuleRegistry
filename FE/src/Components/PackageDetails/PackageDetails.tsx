import { Package } from '../../Models/Models';
import { PackageDetailsIconsComponent } from '../PackageDetailsIcons/PackageDetailsIcons';
import {
    PackageDetailsContainer,
    PackageFieldKey,
    PackageFieldRow,
    PackageFieldValue,
} from './PackageDetailsStyle';

interface PackageComponentProps {
    packageProp: Package;
}

export const PackageDetailsComponent = ({ packageProp }: PackageComponentProps) => {
    return (
        <PackageDetailsContainer>
            <PackageDetailsIconsComponent
                visibility={packageProp.visibility}
                safety={packageProp.safety}
                isExternal={packageProp.isExternal}
            />
            {Object.entries(packageProp.ratings).map(([ratingName, ratingValue]) => (
                <PackageFieldRow>
                    <PackageFieldKey>{ratingName}</PackageFieldKey>
                    <PackageFieldValue rating={ratingValue}>
                        {parseFloat(ratingValue).toFixed(4)}
                    </PackageFieldValue>
                </PackageFieldRow>
            ))}
        </PackageDetailsContainer>
    );
};
