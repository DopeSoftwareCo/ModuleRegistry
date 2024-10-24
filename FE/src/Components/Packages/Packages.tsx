import { Packages } from '../../Models/Models';
import { PackageComponent } from '../Package/Package';
import { PackagesContainer } from './PackagesStyle';

interface PackagesComponentProps {
    packages: Packages;
    specificDetails?: { [key: string]: number | string };
}

export const PackagesComponent = ({ packages, specificDetails }: PackagesComponentProps) => {
    return (
        <PackagesContainer>
            {packages.map((packageProp) => (
                <PackageComponent packageProp={packageProp} specificDetails={specificDetails} />
            ))}
        </PackagesContainer>
    );
};
