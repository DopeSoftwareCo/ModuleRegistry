import fs from "fs";
import { execSync } from "child_process";
import path from "path";
import { LogDebug } from "../../../Utils/Log";

export interface DependencyTree {
    name: string; // Package name
    version?: string; // Package version
    size?: number; // Size of the package in bytes (added property)
    dependencies?: Record<string, DependencyTree>; // Nested dependencies
}

export type Dependency = { name: string; version: string };
export type DependencySize = { name: string; version: string; size: number };

export const fetchDependencyTree = (
    packageName: string,
    packageManager: string,
    verbose: boolean = true
): DependencyTree => {
    try {
        const fetching = `Fetching dependency tree for ${packageName} using ${packageManager}...`;
        verbose ? console.log(fetching) : LogDebug(fetching);

        const command = `${packageManager} ls ${packageName} --json --depth=Infinity`;
        const result = execSync(command, { encoding: "utf-8" });
        const parsedResult = JSON.parse(result);

        // Optionally set size here if available (e.g., from metadata)
        parsedResult.size = calculateZipSize({ name: parsedResult.name, version: parsedResult.version });
        return parsedResult;
    } catch (error) {
        LogDebug(`Skipping ${packageName}: ${error}`);
        return {
            name: packageName,
            size: 0,
            dependencies: {},
        };
    }
};

export function calculateZipSize(dependency: Dependency): number {
    const tempDir = path.resolve("temp_zips");
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
    }

    const packageName = `${dependency.name}@${dependency.version}`;
    const zipPath = path.join(tempDir, `${dependency.name.replace("/", "_")}.tgz`);

    // Pack the dependency using `npm pack`
    try {
        execSync(`npm pack ${dependency.name}@${dependency.version} --pack-destination ${tempDir}`, {
            stdio: "ignore",
        });
        const size = fs.statSync(zipPath).size;
        return size;
    } catch (error) {
        LogDebug(`Error fetching size for ${packageName}: ${error}`);
        return 0;
    } finally {
        // Clean up the zip file
        if (fs.existsSync(zipPath)) {
            fs.unlinkSync(zipPath);
        }
    }
}

export const calculateCumulativeSize = (
    packages: string[],
    packageManager: string,
    verbose: boolean = true
): number => {
    let totalSize = 0;
    const processedPackages = new Set<string>(); // Avoid double-counting

    packages.forEach((packageName) => {
        const dependencyTree = fetchDependencyTree(packageName, packageManager, verbose);

        if (!dependencyTree || !dependencyTree.dependencies) {
            const notFound = `No dependencies found for ${packageName}, skipping.`;
            verbose ? console.warn(notFound) : LogDebug(notFound);
            return; // Skip if the dependency tree is invalid
        }

        // Helper function to recursively calculate the size
        const calculateSize = (tree: DependencyTree): number => {
            if (!tree || processedPackages.has(tree.name)) return 0; // Skip already processed
            processedPackages.add(tree.name); // Mark package as processed

            let size = tree.size || 0; // Use `size` directly from the DependencyTree
            if (tree.dependencies) {
                Object.values(tree.dependencies).forEach((dep) => {
                    size += calculateSize(dep);
                });
            }
            return size;
        };

        totalSize += calculateSize(dependencyTree);
    });

    return totalSize;
};
