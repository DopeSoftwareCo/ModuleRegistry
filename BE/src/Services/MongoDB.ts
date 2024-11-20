import PackageModel, { MongoPackage } from "../Schemas/Package";

export const createRandomPackage = async (version: string, name: string = "Example Package Name") => {
    const newPackage: MongoPackage = new PackageModel({
        Title: "Example Package",
        repoUrl: "https://github.com/example/package",
        metadata: {
            Name: name,
            Version: version,
            License: {
                name: "MIT",
                spxId: "MIT",
                url: "https://opensource.org/licenses/MIT",
            },
            Uploader: "Uploader123",
            IsExternal: true,
            Safety: "vetted",
            IsSecret: false,
            Visibility: "public",
            Availability: Math.random(),
            PrivelegedGroup: Math.random(),
        },
        data: {
            Content: "Example content for the package.",
            JSProgram: "console.log('Hello, World!');",
        },
        RampupTime: {
            rampup_score: Math.random(),
            rampup_score_latency: Math.random(),
        },
        Correctness: {
            score_correctness: Math.random(),
            score_correctness_latency: Math.random(),
        },
        BusFactor: {
            score_busFactor: Math.random(),
            score_busFactor_latency: Math.random(),
        },
        Responsiveness: {
            score_responsiveMaintainer: Math.random(),
            score_responsiveMaintainer_latency: Math.random(),
        },
        LicenseCompatibility: {
            score_license: Math.random(),
            score_license_latency: Math.random(),
        },
        VersionDependence: {
            score_versionDependence: Math.random(),
            score_versionDependence_latency: Math.random(),
        },
        MergeRestriction: {
            score_mergeRestriction: Math.random(),
            score_mergeRestriction_latency: Math.random(),
        },
        IndividualSizeCost: {
            score_sizeCostStandalone: Math.random(),
            score_sizeCostStandalone_latency: Math.random(),
        },
        TotalSizeCost: {
            score_sizeCostTotal: Math.random(),
            score_sizeCostTotal_latency: Math.random(),
        },
        GoodPinningPractice: {
            score_goodPinningPractice: Math.random(),
            score_goodPinningPracticeLatency: Math.random(),
        },
        PullRequest: {
            score_pullRequest: Math.random(),
            score_pullRequestLatency: Math.random(),
        },
        FinalRating: {
            netscore: Math.random(),
            netscore_latency: Math.random(),
        },
    });
    await newPackage.save();
};

export function MakeFakePackage(version: string, name: string): MongoPackage {
    const newPackage: MongoPackage = new PackageModel({
        Title: "Example Package",
        repoUrl: "https://github.com/example/package",
        metadata: {
            Name: name,
            Version: version,
            License: {
                name: "MIT",
                spxId: "MIT",
                url: "https://opensource.org/licenses/MIT",
            },
            Uploader: "Uploader123",
            IsExternal: true,
            Safety: "vetted",
            IsSecret: false,
            Visibility: "public",
            Availability: Math.random(),
            PrivelegedGroup: Math.random(),
        },
        data: {
            Content: "Example content for the package.",
            JSProgram: "console.log('Hello, World!');",
        },
        RampupTime: {
            rampup_score: Math.random(),
            rampup_score_latency: Math.random(),
        },
        Correctness: {
            score_correctness: Math.random(),
            score_correctness_latency: Math.random(),
        },
        BusFactor: {
            score_busFactor: Math.random(),
            score_busFactor_latency: Math.random(),
        },
        Responsiveness: {
            score_responsiveMaintainer: Math.random(),
            score_responsiveMaintainer_latency: Math.random(),
        },
        LicenseCompatibility: {
            score_license: Math.random(),
            score_license_latency: Math.random(),
        },
        VersionDependence: {
            score_versionDependence: Math.random(),
            score_versionDependence_latency: Math.random(),
        },
        MergeRestriction: {
            score_mergeRestriction: Math.random(),
            score_mergeRestriction_latency: Math.random(),
        },
        IndividualSizeCost: {
            score_sizeCostStandalone: Math.random(),
            score_sizeCostStandalone_latency: Math.random(),
        },
        TotalSizeCost: {
            score_sizeCostTotal: Math.random(),
            score_sizeCostTotal_latency: Math.random(),
        },
        GoodPinningPractice: {
            score_goodPinningPractice: Math.random(),
            score_goodPinningPracticeLatency: Math.random(),
        },
        PullRequest: {
            score_pullRequest: Math.random(),
            score_pullRequestLatency: Math.random(),
        },
        FinalRating: {
            netscore: Math.random(),
            netscore_latency: Math.random(),
        },
    });
    return newPackage;
}
