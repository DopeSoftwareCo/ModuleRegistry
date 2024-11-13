import { minify } from 'terser';
import fs from 'fs';
import axios from 'axios';
import path from 'path';
import unzipper, { Entry } from 'unzipper'
/**
 * @author Ben Kanter
 * @param content package content encoded in binary
 * @returns minified package
 */
export async function debloatUploadedContent(content: string): Promise<string> {
    const result = (await minify(content)).code as string; // Since we are passing a string into the function, result has to be a string
    return result;
}