export interface LicenseInfo {
    name: string; // License name (e.g., "MIT")
    spdxId: string; // SPDX identifier (e.g., "MIT")
    url: string; // URL to the license details
}

export const Empty_LicenseInfo = { name: "???", url: " ", spdxId: " " };

export type RepositoryWithLicense = {
    licenseInfo: LicenseInfo | null; // The license information of the repository, could be null if not available
};
