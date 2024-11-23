import fs from "fs";
import { execSync } from "child_process";
import path from "path";

interface DependencyTree {
    name: string; // Package name
    version?: string; // Package version
    dependencies?: Record<string, DependencyTree>; // Nested dependencies
}

type Dependency = { name: string; version: string };
type DependencySize = { name: string; version: string; size: number };

export function fetchDependencyTree(packageName: string, packageManager: "npm" | "yarn"): Dependency[] {
    const command =
        packageManager === "npm"
            ? `npm ls ${packageName} --json --depth=Infinity`
            : `yarn list ${packageName} --json`;

    const result = execSync(command, { encoding: "utf-8" });
    const parsed: DependencyTree = JSON.parse(result); // Specify the type here
    const dependencies: Dependency[] = [];

    function traverse(node: DependencyTree) {
        if (node.dependencies) {
            for (const [depName, depInfo] of Object.entries(node.dependencies)) {
                dependencies.push({ name: depName, version: depInfo.version! }); // Ensure version is not undefined
                traverse(depInfo);
            }
        }
    }

    traverse(parsed);
    return dependencies;
}

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
        console.error(`Error fetching size for ${packageName}:`, error);
        return 0;
    } finally {
        // Clean up the zip file
        if (fs.existsSync(zipPath)) {
            fs.unlinkSync(zipPath);
        }
    }
}

export function calculateCumulativeSize(packages: string[], packageManager: "npm" | "yarn"): number {
    const allDependencies = new Map<string, DependencySize>();

    for (const pkg of packages) {
        const dependencies = fetchDependencyTree(pkg, packageManager);
        for (const dep of dependencies) {
            const key = `${dep.name}@${dep.version}`;
            if (!allDependencies.has(key)) {
                const size = calculateZipSize(dep);
                allDependencies.set(key, { ...dep, size });
            }
        }
    }

    const totalSize = Array.from(allDependencies.values()).reduce((sum, { size }) => sum + size, 0);

    return totalSize;
}
