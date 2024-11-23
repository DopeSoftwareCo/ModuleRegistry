import { readFileSync, writeFile } from "fs";
import { SuperRepoBuilder } from "../RepoComponents/Builders/SuperRepoBuilder";
import { Repository } from "../RepoComponents/Repository";

/**
 * Parse a file containing URLs and calculate metrics for each repository.
 *
 * @param filepath - The file path to the file containing GitHub or npm package URLs (one per line).
 */
export async function ParseURLFile(filepath: string): Promise<Repository[] | undefined> {
    // Read the file and split the content into an array of URLs
    const urls = readFileSync(filepath, "utf-8").split("\n").filter(Boolean); // Removes empty lines
    const superBuilder = new SuperRepoBuilder();

    // Create NDJSON file
    writeFile(`${filepath}.NDJSON`, "", (err) => {
        if (err) {
            console.error(err);
        } else {
            // File written successfully
        }
    });
    return await superBuilder.MultiSuperBuild(urls);
}
