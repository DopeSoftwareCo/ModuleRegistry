import fs from "fs";
import { execSync } from "child_process";
import path from "path";
import { LogDebug } from "../../Utils/Log";

interface DependencyTree {
    name: string; // Package name
    version?: string; // Package version
    dependencies?: Record<string, DependencyTree>; // Nested dependencies
}

type Dependency = { name: string; version: string };
type DependencySize = { name: string; version: string; size: number };

export const fetchDependencyTree = (
    packageName: string,
    packageManager: string,
    verbose: boolean = true
): any => {
    try {
        const fetching = `Fetching dependency tree for ${packageName} using ${packageManager}...`;
        verbose ? console.log(fetching) : LogDebug(fetching);

        const command = `${packageManager} ls ${packageName} --json --depth=Infinity`;
        const result = execSync(command, { encoding: "utf-8" });
        return JSON.parse(result);
    } catch (error) {
        LogDebug(`Skipping ${packageName}: ${error}`);
        // Returning a default structure for a skipped package
        return {
            name: packageName,
            size: 0, // or estimated size if you want to provide a default
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
    const processedPackages = new Set<string>();

    packages.forEach((packageName) => {
        const dependencyTree = fetchDependencyTree(packageName, packageManager, verbose);

        if (!dependencyTree || !dependencyTree.dependencies) {
            const notFound = `No dependencies found for ${packageName}, skipping.`;
            verbose ? console.warn(notFound) : LogDebug(notFound);
            return; // Skip if the dependency tree is invalid
        }

        // Helper function to recursively calculate the size
        const calculateSize = (tree: any) => {
            if (!tree || processedPackages.has(tree.name)) return 0;
            processedPackages.add(tree.name);

            let size = tree.size || 0; // Replace with your logic for determining the size
            if (tree.dependencies) {
                Object.values(tree.dependencies).forEach((dep: any) => {
                    size += calculateSize(dep);
                });
            }
            return size;
        };

        totalSize += calculateSize(dependencyTree);
    });

    return totalSize;
};
