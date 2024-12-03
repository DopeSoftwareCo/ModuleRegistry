import { existsSync, mkdirSync } from "fs";
import path from "path";

export const packagesDirectory = path.join(process.cwd(), "Data/Packages");
export const tempDirectory = packagesDirectory + "/.Temp";

export const ensureUploadFoldersExist = () => {
    if (!existsSync(packagesDirectory)) {
        mkdirSync(packagesDirectory, { recursive: true });
    }
    if (!existsSync(tempDirectory)) {
        mkdirSync(tempDirectory, { recursive: true });
    }
};
