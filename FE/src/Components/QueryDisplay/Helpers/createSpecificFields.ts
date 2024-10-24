import { Package, PackageMetaDataFromAPI, PackageRatingFromAPI, Packages } from '../../../Models/Models';

export const buildSpecificFields = (
    ...fields: [string, string | number][]
): { [key: string]: string | number } => {
    return fields.reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
    }, {} as { [key: string]: string | number });
};

export const createSpecificFields = (
    packages: Partial<Packages>,
    desiredFields: (keyof Package | keyof PackageRatingFromAPI | keyof PackageMetaDataFromAPI)[]
) => {};
