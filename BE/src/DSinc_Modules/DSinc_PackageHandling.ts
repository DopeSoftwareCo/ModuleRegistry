import { minify } from 'terser';
import fs from 'fs';
import path from 'path';
import * as unzipper from 'unzipper';
import * as tar from 'tar';
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
    const tempIDCeiling = 1000;
    const tempID = (Math.floor((Math.random() * tempIDCeiling) + 1)).toString();
    const tempBackupFileDirectory = path.join(tempUnzippedDirectory, tempID);
    await fs.promises.cp(folderPath, tempBackupFileDirectory, { recursive: true }) // Creates a backup
    try { // Puts everything in a try block due to lots of file system interactions
        const directoryContents = await fs.promises.readdir(folderPath, { withFileTypes: true });
        for (let file of directoryContents) {
            const filePath = path.join(folderPath, file.name);
            if (file.isDirectory()) {
                isSuccessful = await debloatUnzippedContent(filePath);
            }
            else if (file.isFile() && file.name.endsWith('.js')) {
                const fileContent = await fs.promises.readFile(filePath, 'utf-8');
                const debloatedContent = await debloatUploadedContent(fileContent);
                if (fileContent.length < debloatedContent.length) {
                    isSuccessful = false; // Skips writing, something went wrong
                    throw new Error("Debloat Failed for file: " + filePath)
                }
                else {
                    await fs.promises.writeFile(filePath, debloatedContent, 'utf-8');
                }
            }
            // All other files ignored
        }
        await fs.promises.rm(tempBackupFileDirectory, { recursive: true, force: true }) // Remove backup
    }
    catch (error) {
        isSuccessful = false;
        console.error(error);
        // Replace with original if it fails at any point. 
        await fs.promises.rm(folderPath, { recursive: true, force: true });
        await fs.promises.rename(tempBackupFileDirectory, folderPath);
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
    const tempIDCeiling = 1000;
    const tempID = (Math.floor((Math.random() * tempIDCeiling) + 1)).toString();
    const tempUnzippedFileDirectory = path.join(tempUnzippedDirectory, tempID);

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
        console.error("Not a supported archive file. Only supports .zip and .tar.gz");
        return false; // Not a supported zip archive
    }
    try {
        if (isZip) {
            const zippedContent = await fs.promises.readFile(zipPath);
            await unzipper.Open.buffer(zippedContent).then((directory) => directory.extract ({ path: tempUnzippedFileDirectory}));
        }
        else if (isTarGz) {
            await fs.promises.mkdir(tempUnzippedFileDirectory);
            await tar.x({file: zipPath, C: tempUnzippedFileDirectory});
        }
        isSuccessful = await debloatUnzippedContent(tempUnzippedFileDirectory);
    }
    catch (error) {
        isSuccessful = false;
        console.error(error);
    }
    
    if (isSuccessful) {
        const backupZipPath = (zipPath + "_"); // Purpose of this is to provide a failsafe in case zipping operation fails
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
            archive.on('error', (error) => {
                throw error; // Gets caught and logged
            });
            archive.pipe(output);
            archive.directory(tempUnzippedDirectory, false);
            archive.finalize();
            await fs.promises.rm(backupZipPath); // Removes the temp directory
        }
        catch (error){
            console.error(error);
            if (fs.existsSync(zipPath)) {
                await fs.promises.rm(zipPath); // Removes in case there is some file there
            }
            await fs.promises.rename(backupZipPath, backupZipPath.slice(0, backupZipPath.length-1)); // Revert
            isSuccessful = false;
        }
    }
    await fs.promises.rm(tempUnzippedFileDirectory, { recursive: true, force: true}); // Removes the temp directory
    return isSuccessful;
}