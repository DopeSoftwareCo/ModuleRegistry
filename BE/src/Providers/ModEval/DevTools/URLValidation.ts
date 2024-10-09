import { readFileSync } from "fs";



export type RepoURL_Details =
{
    repoURL: string;
    tokens: RegExpMatchArray;
}


export function IsNpmLink(url: string): boolean
{
    // Regex to check if the input is an npmjs URL
    const npmRegex = /^(https?:\/\/)?(www\.)?npmjs\.com\/package\/(.+)$/;
    return npmRegex.test(url);
}


export function ValidateRepoURL(url: string): RepoURL_Details | undefined
{
    const githubRepoRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/([^\/]+)\/([^\/]+?)(?:\.git)?$/;
    const match = url.match(githubRepoRegex);

    if(match)
    {
        const details: RepoURL_Details =
        {
            repoURL: url,
            tokens: match
        }
    }
    return undefined;
}


export async function RetrieveGitHubURL(url: string): Promise<RepoURL_Details | undefined>
{
    if (IsNpmLink(url))
    {
        const packageName = url.split('/').pop(); // Extract package name from the URL

        try
        {
            // Fetch the package details from the npm registry
            const response = await fetch(`https://registry.npmjs.org/${packageName}`);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Await the JSON response properly to resolve the promise
            const packageData = await response.json(); 

            // Extract the GitHub repository URL if it exists
            let repositoryUrl = packageData.repository?.url;
            return ValidateRepoURL(repositoryUrl);
        }
        catch { return undefined;}
    }

    // Ok ... url isn't an npm url, so either it's a github url or it's invalid
    return ValidateRepoURL(url);
}


export function ReadFileUrls(filepath: string): Array<string> 
{    
    const fileContents = readFileSync(filepath, 'utf8');
    const urls = fileContents.split(/\r?\n/).filter((line) => line.trim() !== '');

    return urls;
}
