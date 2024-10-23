import { RegistryPackage } from "../classes/RegistryPackage";

/**
 * @author Jorge Puga Hernandez
 * @description
 * - This function calculates the cost of a single package based on the total
 * megabytes (MB) that need to be downloaded. The package content is a zip file
 * encoded as Base64, which introduces overhead. This function uses the Base64
 * content length to calculate the original size of the zip file, converting it
 * into megabytes.
 *
 * - The calculation adjusts for padding in the Base64 content. The formula for
 * determining the original size is derived from:
 * https://stackoverflow.com/questions/34109053/what-file-size-is-data-if-its-450kb-base64-encoded
 *
 * @param pack - The RegistryPackage object containing Base64-encoded content. {@type RegistryPackage}
 * @returns {number} - The total size of the package in megabytes (MB) rounded two decimal places.
 */
export const CalcPackageCost = (pack: RegistryPackage): number => {
    // Get the length in bytes of the Base64 encoded package.
    const base64Content = pack.Content || "";
    const base64Bytes = Buffer.byteLength(base64Content, "utf8");

    // Calculate the number of padding characters.
    const paddingBytes = base64Content.endsWith("==") ? 2 : base64Content.endsWith("=") ? 1 : 0;

    // Get the original size of the package and convert it to megabytes.
    const originalBytes = (base64Bytes * 3) / 4 - paddingBytes;
    const sizeInMB = originalBytes / (1024 * 1024);

    return Math.round(sizeInMB * 100) / 100;
};

/**
 * @author Jorge Puga Hernandez
 * @description
 * - This function calculates the total cost of a package and its dependencies by
 *  summing the size of the package itself and all its dependencies. It takes an
 *  array of RegistryPackage objects representing the dependencies and adds their
 *  size to the total cost.
 *
 * - Each dependency is recursively processed to calculate its size, and the function
 *  returns the total size in megabytes (MB) of the package and all its dependencies.
 *
 * @param pack - The RegistryPackage object representing the main package. {@type RegistryPackage}
 * @param dependencies - An array of RegistryPackage objects representing the package's dependencies. {@type RegistryPackage[]}
 * @returns {number} - The total size (in MB) of the package and its dependencies rounded two decimal places.
 */
export const CalcDependencyCost = (pack: RegistryPackage, dependencies: RegistryPackage[]): number => {
    let totalDependencySize = 0;

    // Iterate through the dependencies passed in (assumed to be other RegistryPackage instances)
    for (const dependency of dependencies) {
        const dependencySize = CalcPackageCost(dependency);
        totalDependencySize += dependencySize;
    }

    // Return the total cost, which is the current package size + all dependencies
    const totalCost = CalcPackageCost(pack) + totalDependencySize;

    return Math.round(totalCost * 100) / 100;
};
