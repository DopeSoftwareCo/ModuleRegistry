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
    specificDetails?: { [key: string]: number | string };
}

export const PackageDetailsComponent = ({ packageProp, specificDetails }: PackageComponentProps) => {
    return (
        <PackageDetailsContainer>
            <PackageDetailsIconsComponent
                visibility={packageProp.visibility}
                safety={packageProp.safety}
                isExternal={packageProp.isExternal}
            />
            {specificDetails &&
                Object.entries(specificDetails).map(([specificKey, specificValue]) => (
                    <PackageFieldRow>
                        <PackageFieldKey>{specificKey}</PackageFieldKey>
                        <PackageFieldValue>{specificValue}</PackageFieldValue>
                    </PackageFieldRow>
                ))}
        </PackageDetailsContainer>
    );
};
