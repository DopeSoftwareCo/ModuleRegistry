import {
    PackageContainer,
    PackageID,
    PackageName,
    PackageNameVersionContainer,
    PackageNVUrlContainer,
    PackageUpdateDate,
    PackageUploader,
    PackageUrl,
    PackageVersion,
    UploadInformationContainer,
} from './PackageComponentStyle';

export interface PackageComponentProps {
    id: string;
    name: string;
    version: string;
    uploader: string;
    updateDate: string;
    url: string;
}

export const PackageComponent = ({ id, name, version, uploader, updateDate, url }: PackageComponentProps) => {
    return (
        <PackageContainer>
            <PackageNVUrlContainer>
                <PackageNameVersionContainer>
                    <PackageName>{name}</PackageName>
                    <PackageVersion>{version}</PackageVersion>
                </PackageNameVersionContainer>
                <PackageUrl href={url}>{url}</PackageUrl>
            </PackageNVUrlContainer>
            <UploadInformationContainer>
                <PackageUploader>{uploader}</PackageUploader>
                <PackageUpdateDate>{updateDate}</PackageUpdateDate>
            </UploadInformationContainer>
            <PackageID>{id}</PackageID>
        </PackageContainer>
    );
};
