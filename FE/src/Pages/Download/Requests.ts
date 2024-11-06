import { GeneralConfig } from '../../Config/config';
import { PackageFromAPIDownload } from '../../Models/Models';

const createBlobUrl = (
    base64Content: string | undefined,
    name: string,
    version: string,
    errorSetter: (error: string) => void,
    blobUrlSetter: (blobUrl: string) => void,
    fileNameSetter: (name: string) => void
) => {
    try {
        if (!base64Content) {
            throw new Error('base64 content did not exist for this package');
        }
        const base64Data = base64Content.split(',')[1];
        const mimeMatching = base64Content.match(/^data:([^;]+);base64,/);
        if (!mimeMatching) {
            throw new Error('mime type not found in base64');
        }
        const mimeType = mimeMatching[1];
        const fileExtension = mimeType.split('/')[1];
        const byteCharacters = atob(base64Data); // Decode base64
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mimeType });

        // Step 4: Create a download URL from the Blob and save it in state
        const blobUrl = URL.createObjectURL(blob);
        console.log(`${name}.${fileExtension}`);
        blobUrlSetter(blobUrl);
        fileNameSetter(`${name}-${version}.${fileExtension}`);
    } catch (err) {
        if (err instanceof Error) {
            errorSetter(err.message);
        } else errorSetter('An unknown error occured in createBlobUrl, called from getPackageByIDRequest.');
    }
};

export const getPackageByIDRequest = async (
    id: string,
    errorSetter: (error: string) => void,
    blobUrlSetter: (url: string) => void,
    fileNameSetter: (name: string) => void
): Promise<PackageFromAPIDownload | undefined> => {
    try {
        const response = await fetch(`${GeneralConfig.BACKEND_URL}package/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${localStorage.getItem('token')}`,
            },
        });

        if (!response.ok) {
            const responseText = await response.text();
            errorSetter(responseText);
            return undefined;
        }

        const downloadablePackageFromAPI: PackageFromAPIDownload = await response.json();
        createBlobUrl(
            downloadablePackageFromAPI.data.Content,
            downloadablePackageFromAPI?.metadata?.Name
                ? downloadablePackageFromAPI.metadata.Name
                : 'NoNamePackage',
            downloadablePackageFromAPI?.metadata?.Version
                ? downloadablePackageFromAPI.metadata.Version
                : '0.0.0',
            errorSetter,
            blobUrlSetter,
            fileNameSetter
        );
        return downloadablePackageFromAPI;
    } catch (err) {
        if (err instanceof Error) {
            errorSetter(err.message);
        } else errorSetter('an unknown error occured in getPackagesViaRegexRequest');
    }
};
