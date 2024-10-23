export type NDJSONRow = Partial<{
    URL: string;
    NetScore: number;
    NetScore_Latency: number;
    RampUp: number;
    RampUp_Latency: number;
    Correctness: number;
    Correctness_Latency: number;
    BusFactor: number;
    BusFactor_Latency: number;
    ResponsiveMaintainer: number;
    ResponsiveMaintainer_Latency: number;
    License: number;
    License_Latency: number;
    VersionDependence: number;
    VersionDependence_Latency: number;
    MergeControl: number;
    MergeControl_Latency: number;
}>;

export const EMPTY_REPO_NDJSON: NDJSONRow = {
    URL: "unknown",
    NetScore: -1,
    NetScore_Latency: -1,
    RampUp: -1,
    RampUp_Latency: -1,
    Correctness: -1,
    Correctness_Latency: -1,
    BusFactor: -1,
    BusFactor_Latency: -1,
    ResponsiveMaintainer: -1,
    ResponsiveMaintainer_Latency: -1,
    License: -1,
    License_Latency: -1,
    VersionDependence: -1,
    VersionDependence_Latency: -1,
    MergeControl: -1,
    MergeControl_Latency: -1,
};

export function IsEmpty_RepoNDJSON(row: NDJSONRow): boolean {
    return row == EMPTY_REPO_NDJSON;
}
