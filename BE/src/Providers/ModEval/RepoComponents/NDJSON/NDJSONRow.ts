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
    NetScore: 0,
    NetScore_Latency: 0,
    RampUp: 0,
    RampUp_Latency: 0,
    Correctness: 0,
    Correctness_Latency: 0,
    BusFactor: 0,
    BusFactor_Latency: 0,
    ResponsiveMaintainer: 0,
    ResponsiveMaintainer_Latency: 0,
    License: 0,
    License_Latency: 0,
    VersionDependence: 0,
    VersionDependence_Latency: 0,
    MergeControl: 0,
    MergeControl_Latency: 0,
};

export function IsEmpty_RepoNDJSON(row: NDJSONRow): boolean {
    return row == EMPTY_REPO_NDJSON;
}
