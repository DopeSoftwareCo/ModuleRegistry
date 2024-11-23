import { NDJSONRow } from "../../Providers/RepoEvaluator/RepoComponents/NDJSON/NDJSONRow";
import PackageModel, { Package } from "../../Schemas/Package";

type Scores = NDJSONRow & {
    GoodPinningPracticeScore: number;
    GoodPinningPracticeLatency: number;
    PullRequestScore: number;
    PullRequestLatency: number;
};

export const buildMongoDBPackage = async (
    row: Scores,
    url: string,
    name: string,
    version: string,
    license: string,
    isExternal: boolean,
    individualSizeCost: number,
    totalSizeCost: number
) => {
    const pToSave = new PackageModel({
        repoUrl: url,
        metadata: {
            Name: name,
            Version: version,
            License: {
                name: license,
            },
            IsExternal: isExternal,
        },
        RampupTime: {
            rampup_score: row.RampUp,
            rampup_score_latency: row.RampUp_Latency,
        },
        Correctness: {
            score_correctness: row.Correctness,
            score_correctness_latency: row.Correctness_Latency,
        },
        BusFactor: {
            score_busFactor: row.BusFactor,
            score_busFactor_latency: row.BusFactor_Latency,
        },
        Responsiveness: {
            score_responsiveMaintainer: row.ResponsiveMaintainer,
            score_responsiveMaintainer_latency: row.ResponsiveMaintainer_Latency,
        },
        LicenseCompatibility: {
            score_license: row.License,
            score_license_latency: row.License_Latency,
        },
        VersionDependence: {
            score_versionDependence: row.VersionDependence,
            score_versionDependence_latency: row.VersionDependence_Latency,
        },
        MergeRestriction: {
            score_mergeRestriction: row.MergeControl,
            score_mergeRestriction_latency: row.MergeControl_Latency,
        },
        IndividualSizeCost: {
            score_sizeCostStandalone: individualSizeCost,
            score_sizeCostStandalone_latency: 0,
        },
        TotalSizeCost: {
            score_sizeCostTotal: totalSizeCost,
            score_sizeCostTotal_latency: 0,
        },
        GoodPinningPractice: {
            score_goodPinningPractice: row.GoodPinningPracticeScore,
            score_goodPinningPracticeLatency: row.GoodPinningPracticeLatency,
        },
        PullRequest: {
            score_pullRequest: row.PullRequestScore,
            score_pullRequestLatency: row.PullRequestLatency,
        },
        FinalRating: {
            netscore: row.NetScore,
            netscore_latency: row.NetScore_Latency,
        },
    });
    const savedPackage = await pToSave.save();
    return savedPackage._id.toString();
};

export const createRandomPackage = async (version: string) => {
    const newPackage: Package = new PackageModel({
        Title: "Example Package",
        repoUrl: "https://github.com/example/package",
        metadata: {
            Name: "Example Package Name",
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
    const savedPackage = await newPackage.save();
    return savedPackage._id.toString();
};
