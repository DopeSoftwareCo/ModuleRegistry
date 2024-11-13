import { minify } from 'terser';
import fs from 'fs';
import axios from 'axios';
import path from 'path';
// import unzipper, { Entry } from 'unzipper'
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
 * @returns whether or not operation was successful
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