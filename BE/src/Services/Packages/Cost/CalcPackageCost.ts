import fetch from "node-fetch";

/**
 * @author Jorge Puga Hernandez
 * @description Calculates the standalone cost of a package from the provided URL, excluding
 * dependencies. This function attempts to retrieve the size data from Package Phobia.
 *
 * @param packageUrl The GitHub URL of the package.
 * @returns - A promise that resolves to the standalone package size in megabytes (MB).
 *          - Will return 0 if it can't calculate the cost with the given URL.
 */
export async function CalculateStandaloneCost(packageUrl: string): Promise<number> {
    const packageName = extractPackageName(packageUrl);
    console.log(`Package name in calculate standalone cost: ${packageName}`);
    if (!packageName) {
        console.log(`Returning 0 in standalone for: ${packageName}`);
        return 0;
    }

    try {
        return await getStandaloneCost(packageName);
    } catch (error) {
        console.log(
            error instanceof Error ? error.message : "unknown error occured obtaining standalone cost"
        );
        return 0;
    }
}

/**
 * @author Jorge Puga Hernandez
 * @description Calculates the total cost of a package from the provided URL, including dependencies.
 * This function attempts to retrieve the size data from Package Phobia.
 *
 * @param packageUrl The GitHub URL of the package repository.
 * @returns - A promise that resolves to the total package size in megabytes (MB).
 *          - Will return 0 if it can't calculate the cost with the given URL.
 */
export async function CalculateTotalCost(packageUrl: string): Promise<number> {
    const packageName = extractPackageName(packageUrl);
    console.log(`Package name in calculate total cost: ${packageName}`);
    if (!packageName) {
        console.log(`Returning 0 in total for: ${packageName}`);
        return 0;
    }

    try {
        return await getTotalCost(packageName);
    } catch (error) {
        console.log(error instanceof Error ? error.message : "unknown error occured obtaining total cost");
        return 0;
    }
}

/**
 * @author Jorge Puga Hernandez
 * @description Fetches the standalone (publish) size of a package from Package Phobia without deps.
 *
 * @param packageName The name of the npm package.
 * @returns - A promise that resolves to the standalone size in megabytes (MB).
 */
async function getStandaloneCost(packageName: string): Promise<number> {
    console.log(`Getting standalone cost from external resource for: ${packageName}`);
    const phobiaUrl = `https://packagephobia.com/v2/api.json?p=${packageName}`;
    const response = await fetch(phobiaUrl);
    try {
        console.log(await response.text());
    } catch {
        console.log("could not convert standalone response to text");
    }
    const data = await response.json();

    const bytesInMB = data.publish.bytes / (1024 * 1024);
    return Math.round(bytesInMB * 10) / 10;
}

/**
 * @author Jorge Puga Hernandez
 * @description Fetches the total (install) size of a package from Package Phobia with deps.
 *
 * @param packageName The name of the npm package.
 * @returns - A promise that resolves to the total size in megabytes (MB).
 */
async function getTotalCost(packageName: string): Promise<number> {
    console.log(`Getting total cost from external resource for: ${packageName}`);
    const phobiaUrl = `https://packagephobia.com/v2/api.json?p=${packageName}`;
    const response = await fetch(phobiaUrl);
    try {
        console.log(await response.text());
    } catch {
        console.log("could not convert total response to text");
    }
    const data = await response.json();

    const bytesInMB = data.install.bytes / (1024 * 1024);
    return Math.round(bytesInMB * 10) / 10;
}

/**
 * @author Jorge Puga Hernandez
 * @description Extracts the package name from a GitHub URL, assuming the format https://github.com/user/package.
 *
 * @param url The GitHub URL of the package repository.
 * @returns - The extracted package name or null if the URL format is invalid.
 */
export function extractPackageName(url: string): string | null {
    const match = (url.includes(".git") ? url.split(".git")[0] : url).match(/github\.com\/[^/]+\/([^/]+)/);
    if (match) {
        return match[1];
    } else {
        return null;
    }
}
