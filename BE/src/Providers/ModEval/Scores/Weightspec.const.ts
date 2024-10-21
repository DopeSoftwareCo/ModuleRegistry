import { MetricName } from "./Metric.const";
import { WeightSpec } from "./WeightSpec";

export const RAMPUP_WEIGHT_DEFAULT = 0.3;
export const CORRECTNESS_WEIGHT_DEFAULT = 0.3;
export const BUSFACTOR_WEIGHT_DEFAULT = 0.4;
export const RESPONSIVENESS_WEIGHT_DEFAULT = 0.6;
export const LICENSE_WEIGHT = 1;
export const VERSIONDEP_WEIGHT_DEFAULT = 0.4;
export const MERGERESTRICT_WEIGHT_DEFAULT = 0.9;

export const DEFAULT_WEIGHTS: WeightSpecSet = [
    new WeightSpec(MetricName.RampUpTime, RAMPUP_WEIGHT_DEFAULT),
    new WeightSpec(MetricName.Correctness, CORRECTNESS_WEIGHT_DEFAULT),
    new WeightSpec(MetricName.BusFactor, BUSFACTOR_WEIGHT_DEFAULT),
    new WeightSpec(MetricName.MaintainerResponsiveness, RESPONSIVENESS_WEIGHT_DEFAULT),
    new WeightSpec(MetricName.LienseCompatibility, LICENSE_WEIGHT),
    new WeightSpec(MetricName.VersionDependence, VERSIONDEP_WEIGHT_DEFAULT),
    new WeightSpec(MetricName.MaintainerResponsiveness, MERGERESTRICT_WEIGHT_DEFAULT),
];

export type WeightSpecSet = Array<WeightSpec>;

export const EMPTY_WEIGHTSPEC = new WeightSpec(MetricName.Unknown, 0);
