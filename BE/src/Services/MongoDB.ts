import PackageModel, { Package } from "../Schemas/Package";

export const createRandomPackage = async () => {
    const newPackage: Package = new PackageModel({
        metaData: {
            Name: "randomPackage",
            Version: "1.2.3",
        },
        data: {
            Content: "ASDFASDFASDFASDFASDFASDF",
            JSProgram: "some js program",
        },
        title: `Title:${Math.random() * 10}`,
        repoUrl: "https://github.com/facebook/react",
        uploader: "some name",
        visibility: "public",
        isExternal: Math.random() < 0.5,
        safety: "vetted",
        secrecyEnabled: Math.random() < 0.5,
        license: "some license",
        rampup_score: Math.random(),
        rampup_score_latency: Math.random(),
        score_correctness: Math.random(),
        score_correctness_latency: Math.random(),
        score_busFactor: Math.random(),
        score_busFactor_latency: Math.random(),
        score_license: Math.random(),
        score_license_latency: Math.random(),
        score_versionDependence: Math.random(),
        score_versionDependence_latency: Math.random(),
        score_mergeRestriction: Math.random(),
        score_mergeRestriction_latency: Math.random(),
        score_pullrequest: Math.random(),
        score_pullrequest_latency: Math.random(),
        score_responsiveMaintainer: Math.random(),
        score_responsiveMaintainer_latency: Math.random(),
        score_goodPinningPractice: Math.random(),
        score_goodPinningPractice_latency: Math.random(),
        score_sizeCostTotal: Math.random(),
        score_sizeCostTotal_latency: Math.random(),
        score_sizeCostStandalone: Math.random(),
        score_sizeCostStandalone_latency: Math.random(),
        netscore: Math.random(),
        netscore_latency: Math.random(),
    });
    await newPackage.save();
};
