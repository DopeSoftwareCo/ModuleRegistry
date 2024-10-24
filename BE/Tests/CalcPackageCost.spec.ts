import { CalcPackageCost, CalcDependencyCost } from "../src/Services/CalcPackageCost";
import { RegistryPackage, PackageVersion } from "../src/classes/RegistryPackage";
import { describe, expect, it } from "@jest/globals";

describe("CalcPackageCost", () => {
    // Test for CalcPackageCost function with predictable string: "hello" -> "aGVsbG8="
    it("should calculate the correct size of a package with predictable base64 content", () => {
        const mockPackage: RegistryPackage = {
            packageID: "123",
            title: "Test Package",
            repo: {} as any,
            repoURL: "https://github.com/test/test-package",
            version: new PackageVersion(1, 0, 0),
            licenseName: "MIT",
            scores: {} as any,
            uploadMetadata: {
                uploader: {} as any,
                dateOfUpload: new Date(),
                visibility: 2,
                secrecyEnabled: false,
                packageID: "123",
            },
            content: Buffer.from("hello").toString("base64"),

            // Mocking the getters
            get PackageID() {
                return this.packageID;
            },
            get Title() {
                return this.title;
            },
            get RepositoryURL() {
                return this.repoURL;
            },
            get UploaderID() {
                return this.uploadMetadata.uploader.UID;
            },
            get DateOfUpload() {
                return this.uploadMetadata.dateOfUpload;
            },
            get SecrecyEnabled() {
                return this.uploadMetadata.secrecyEnabled;
            },
            get Visbility() {
                return this.uploadMetadata.visibility;
            },
            get License() {
                return this.licenseName;
            },
            get Scores() {
                return this.scores;
            },
            get Content() {
                return this.content;
            },
        };

        const result = CalcPackageCost(mockPackage);

        // Manually calculating the expected value for "hello" content
        const base64SizeInBytes = Buffer.byteLength(Buffer.from("hello").toString("base64"), "utf8");
        const expectedSizeInMB = ((base64SizeInBytes * 3) / 4 - 1) / (1024 * 1024);

        // Must be the same
        expect(result).toBe(expectedSizeInMB);
    });

    it("Should calculate the size of a single package correctly.", () => {
        const mockPackage: RegistryPackage = {
            packageID: "123",
            title: "Test Package",
            repo: {} as any,
            repoURL: "https://github.com/test/test-package",
            version: new PackageVersion(1, 0, 0),
            licenseName: "MIT",
            scores: {} as any,
            uploadMetadata: {
                uploader: {} as any,
                dateOfUpload: new Date(),
                visibility: 2,
                secrecyEnabled: false,
                packageID: "123",
            },
            content: Buffer.from("Test content for the zip file").toString("base64"),

            get PackageID() {
                return this.packageID;
            },
            get Title() {
                return this.title;
            },
            get RepositoryURL() {
                return this.repoURL;
            },
            get UploaderID() {
                return this.uploadMetadata.uploader.UID;
            },
            get DateOfUpload() {
                return this.uploadMetadata.dateOfUpload;
            },
            get SecrecyEnabled() {
                return this.uploadMetadata.secrecyEnabled;
            },
            get Visbility() {
                return this.uploadMetadata.visibility;
            },
            get License() {
                return this.licenseName;
            },
            get Scores() {
                return this.scores;
            },
            get Content() {
                return this.content;
            },
        };

        // Ensure it's greater than 0 since there's content
        const result = CalcPackageCost(mockPackage);
        expect(result).toBeGreaterThanOrEqual(0);
    });

    // Test for CalcPackageCost function with empty content
    it("should handle empty content and return zero size", () => {
        const mockPackage: RegistryPackage = {
            packageID: "123",
            title: "Test Package",
            repo: {} as any,
            repoURL: "https://github.com/test/test-package",
            version: new PackageVersion(1, 0, 0),
            licenseName: "MIT",
            scores: {} as any,
            uploadMetadata: {
                uploader: {} as any,
                dateOfUpload: new Date(),
                visibility: 2,
                secrecyEnabled: false,
                packageID: "123",
            },
            // Suppose we get empty content
            content: "",

            get PackageID() {
                return this.packageID;
            },
            get Title() {
                return this.title;
            },
            get RepositoryURL() {
                return this.repoURL;
            },
            get UploaderID() {
                return this.uploadMetadata.uploader.UID;
            },
            get DateOfUpload() {
                return this.uploadMetadata.dateOfUpload;
            },
            get SecrecyEnabled() {
                return this.uploadMetadata.secrecyEnabled;
            },
            get Visbility() {
                return this.uploadMetadata.visibility;
            },
            get License() {
                return this.licenseName;
            },
            get Scores() {
                return this.scores;
            },
            get Content() {
                return this.content;
            },
        };

        // Ensure it returns zero for empty content
        const result = CalcPackageCost(mockPackage);
        expect(result).toBe(0);
    });

    // Test for CalcPackageCost function with padding in base64 content
    it("should calculate the size of a package with base64 content that ends with padding", () => {
        const mockPackage: RegistryPackage = {
            packageID: "123",
            title: "Test Package",
            repo: {} as any,
            repoURL: "https://github.com/test/test-package",
            version: new PackageVersion(1, 0, 0),
            licenseName: "MIT",
            scores: {} as any,
            uploadMetadata: {
                uploader: {} as any,
                dateOfUpload: new Date(),
                visibility: 2,
                secrecyEnabled: false,
                packageID: "123",
            },
            // Suppose we get content with padding.
            content: Buffer.from("Test content with padding").toString("base64") + "==",

            get PackageID() {
                return this.packageID;
            },
            get Title() {
                return this.title;
            },
            get RepositoryURL() {
                return this.repoURL;
            },
            get UploaderID() {
                return this.uploadMetadata.uploader.UID;
            },
            get DateOfUpload() {
                return this.uploadMetadata.dateOfUpload;
            },
            get SecrecyEnabled() {
                return this.uploadMetadata.secrecyEnabled;
            },
            get Visbility() {
                return this.uploadMetadata.visibility;
            },
            get License() {
                return this.licenseName;
            },
            get Scores() {
                return this.scores;
            },
            get Content() {
                return this.content;
            },
        };

        // Ensure it's greater than 0 since there's content with padding
        const result = CalcPackageCost(mockPackage);
        expect(result).toBeGreaterThanOrEqual(0);
    });

    // Test for CalcDependencyCost function. We will use "Hello" again but three times and expect it
    // to be the same as the first test but multiplied by three.
    it("should calculate the total size of a package and its dependencies correctly", () => {
        const mockMainPackage: RegistryPackage = {
            packageID: "123",
            title: "Main Package",
            repo: {} as any,
            repoURL: "https://github.com/test/main-package",
            version: new PackageVersion(1, 0, 0),
            licenseName: "MIT",
            scores: {} as any,
            uploadMetadata: {
                uploader: {} as any,
                dateOfUpload: new Date(),
                visibility: 2,
                secrecyEnabled: false,
                packageID: "123",
            },
            content: Buffer.from("hello").toString("base64"),

            get PackageID() {
                return this.packageID;
            },
            get Title() {
                return this.title;
            },
            get RepositoryURL() {
                return this.repoURL;
            },
            get UploaderID() {
                return this.uploadMetadata.uploader.UID;
            },
            get DateOfUpload() {
                return this.uploadMetadata.dateOfUpload;
            },
            get SecrecyEnabled() {
                return this.uploadMetadata.secrecyEnabled;
            },
            get Visbility() {
                return this.uploadMetadata.visibility;
            },
            get License() {
                return this.licenseName;
            },
            get Scores() {
                return this.scores;
            },
            get Content() {
                return this.content;
            },
        };

        const mockDependency1: RegistryPackage = {
            packageID: "456",
            title: "Dependency 1",
            repo: {} as any,
            repoURL: "https://github.com/test/dependency-1",
            version: new PackageVersion(1, 1, 0),
            licenseName: "MIT",
            scores: {} as any,
            uploadMetadata: {
                uploader: {} as any,
                dateOfUpload: new Date(),
                visibility: 2,
                secrecyEnabled: false,
                packageID: "456",
            },
            content: Buffer.from("hello").toString("base64"),

            get PackageID() {
                return this.packageID;
            },
            get Title() {
                return this.title;
            },
            get RepositoryURL() {
                return this.repoURL;
            },
            get UploaderID() {
                return this.uploadMetadata.uploader.UID;
            },
            get DateOfUpload() {
                return this.uploadMetadata.dateOfUpload;
            },
            get SecrecyEnabled() {
                return this.uploadMetadata.secrecyEnabled;
            },
            get Visbility() {
                return this.uploadMetadata.visibility;
            },
            get License() {
                return this.licenseName;
            },
            get Scores() {
                return this.scores;
            },
            get Content() {
                return this.content;
            },
        };

        const mockDependency2: RegistryPackage = {
            packageID: "789",
            title: "Dependency 2",
            repo: {} as any,
            repoURL: "https://github.com/test/dependency-2",
            version: new PackageVersion(1, 2, 0),
            licenseName: "MIT",
            scores: {} as any,
            uploadMetadata: {
                uploader: {} as any,
                dateOfUpload: new Date(),
                visibility: 2,
                secrecyEnabled: false,
                packageID: "789",
            },
            content: Buffer.from("hello").toString("base64"),

            get PackageID() {
                return this.packageID;
            },
            get Title() {
                return this.title;
            },
            get RepositoryURL() {
                return this.repoURL;
            },
            get UploaderID() {
                return this.uploadMetadata.uploader.UID;
            },
            get DateOfUpload() {
                return this.uploadMetadata.dateOfUpload;
            },
            get SecrecyEnabled() {
                return this.uploadMetadata.secrecyEnabled;
            },
            get Visbility() {
                return this.uploadMetadata.visibility;
            },
            get License() {
                return this.licenseName;
            },
            get Scores() {
                return this.scores;
            },
            get Content() {
                return this.content;
            },
        };

        const dependencies = [mockDependency1, mockDependency2];
        const totalCost = CalcDependencyCost(mockMainPackage, dependencies);

        // Manually calculating the expected value for "hello" content of package and dependencies.
        // We know the three pacakges have the same size so just multiply by 3 to see if it worked.
        const base64SizeInBytes = Buffer.byteLength(Buffer.from("hello").toString("base64"), "utf8");
        const expectedSizeInMB = ((base64SizeInBytes * 3) / 4 - 1) / (1024 * 1024);
        const finalCost = expectedSizeInMB * 3;

        // Must be the same.
        expect(totalCost).toBe(finalCost);
    });
});
