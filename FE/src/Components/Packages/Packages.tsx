import { Packages } from '../../Models/Models';
import { PackageComponent } from '../Package/Package';
import { PackagesContainer } from './PackagesStyle';

interface PackagesComponentProps {
    packages: Packages;
}

export const PackagesComponent = ({ packages }: PackagesComponentProps) => {
    return (
        <PackagesContainer>
            {packages.map((packageProp) => (
                <PackageComponent packageProp={packageProp} />
            ))}
        </PackagesContainer>
    );
};
