import { readFileSync } from "fs";
import { ensureUploadFoldersExist, packagesDirectory } from "../../Utils/FileDir";
import PackageModel from "../../Schemas/Package";

export const GetPackageBase64 = (id: string, includeMIME: boolean) => {
    ensureUploadFoldersExist();
    try {
        const repoPath = `${packagesDirectory}/${id}.zip`;
        const fileBuffer = readFileSync(repoPath);
        const base64String = fileBuffer.toString("base64");
        const mimeType = "application/zip";
        return includeMIME ? `data:${mimeType};base64,${base64String}` : base64String;
    } catch (err) {
        console.log(err instanceof Error ? err.message : "Unkown error occured in GetPackageBase64");
        return undefined;
    }
};

export const getDownloadPackageInformation = async (id: string) => {
    try {
        const p = await PackageModel.findById(id);
        return {
            Name: p?.metadata.Name,
            Version: p?.metadata.Version,
            ID: id,
        };
    } catch (err) {
        console.log(
            err instanceof Error ? err.message : "Unknown error occured in getDownloadPackageInformation."
        );
        return undefined;
    }
};
