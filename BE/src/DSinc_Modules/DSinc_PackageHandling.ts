import { minify } from 'terser';
import fs from 'fs';
import axios from 'axios';
import path from 'path';
import * as unzipper from 'unzipper';
import archiver from 'archiver'
/**
 * @author Ben Kanter
 * @param content package content encoded in binary
 * @returns minified package
 */
export async function debloatUploadedContent(content: string): Promise<string> {
    const result = (await minify(content)).code;
    if (result == undefined) {
        console.error("Debloat operation failed, returning original content");
        return content;
    }
    return result;
}

/**
 * @author Ben Kanter
 * Recursive function to find all JS files and debloat them
 * @param folderPath path to unzipped content
 * @returns whether or not operation was completely successful
 * @
 */
export async function debloatUnzippedContent(folderPath: string): Promise<boolean> {
    let isSuccessful = true;
    const directoryContents = await fs.promises.readdir(folderPath, { withFileTypes: true });
    for (let file of directoryContents) {
        const filePath = path.join(folderPath, file.name);
        if (file.isDirectory()) {
            isSuccessful = await debloatUnzippedContent(filePath);
        }
        else if (file.isFile() && file.name.endsWith('.js')) {
            const fileContent = await fs.promises.readFile(filePath, 'utf-8');
            const debloatedContent = await debloatUploadedContent(fileContent);
            await fs.promises.writeFile(filePath, debloatedContent, 'utf-8');
            if (fileContent.length == debloatedContent.length) {
                isSuccessful = false;
            }
        }
        // All other files ignored
    }
    return isSuccessful;
}

/**
 * @author Ben Kanter
 * @param zipPath path to zipped content
 * @returns whether or not operation was completely successful. If unsuccessful, source file remains intact. If successful, debloated zip file replaces the zip.
 */
const tempUnzippedDirectory = path.join(process.cwd(), "Data/Packages/.Temp/Debloat_Operations");
export async function debloatZippedContent(zipPath: string): Promise<boolean> {
    let isSuccessful = true;
    let isZip: boolean = false;
    let isTarGz: boolean = false;
    if (zipPath.endsWith(".zip")) {
        isZip = true;
    }
    else if (zipPath.endsWith(".tar.gz")) {
        isTarGz = true;
    }
    else {
        return false; // Not a supported zip archive
    }
    const zippedContent = await fs.promises.readFile(zipPath);
    const tempIDCeiling = 1000;
    const tempID = (Math.floor((Math.random() * tempIDCeiling) + 1)).toString();
    const tempUnzippedFileDirectory = path.join(tempUnzippedDirectory, tempID);
    await unzipper.Open.buffer(zippedContent).then((directory) => directory.extract ({ path: tempUnzippedFileDirectory}));
    isSuccessful = await debloatUnzippedContent(tempUnzippedFileDirectory);
    if (isSuccessful) {
        const backupZipPath = ("_" + zipPath); // Purpose of this is to provide a failsafe in case zipping operation fails
        await fs.promises.rename(zipPath, backupZipPath);
        try {
            const output = fs.createWriteStream(zipPath);
            let archive; 
            if (isZip) {
                archive = archiver('zip', { zlib: {level: 9} });
            }
            else if (isTarGz) {
                archive = archiver('tar', { gzip: true, gzipOptions: { level: 9 } });
            }
            else { // Something went wrong in an unexpected way.
                throw new Error("Neither a zip or tar, should not get to this point") // Gets caught and logged
            }
            output.on('close', () => {
                return true;
            });
            archive.on('error', (error) => {
                throw error; // Gets caught and logged
            });
            archive.pipe(output);
            archive.directory(tempUnzippedDirectory, false);
            archive.finalize();
        }
        catch (error){
            console.error(error);
            if (fs.existsSync(zipPath)) {
                await fs.promises.rm(zipPath); // Removes in case there is some file there
            }
            await fs.promises.rename(backupZipPath, backupZipPath.slice(1)); // Revert
            return false;
        }
        return true;
    }
    else {
        fs.promises.rm(tempUnzippedDirectory, { recursive: true, force: true}); // Removes the temp directory
        // Does not edit source zip file
    }
    return isSuccessful;
}