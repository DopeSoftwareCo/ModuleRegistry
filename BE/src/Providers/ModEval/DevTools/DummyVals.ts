import { WeightSpec } from "../Scores/WeightSpec";
import { WeightSpecSet } from "../Scores/Weightspec.const";
import { MetricName } from "../Scores/Metric.const";

export const wspec_A0 = new WeightSpec(MetricName.RampUpTime, 0.1);
export const wspec_A1 = new WeightSpec(MetricName.Correctness, 0.2);
export const wspec_A2 = new WeightSpec(MetricName.BusFactor, 0.3);
export const wspec_A3 = new WeightSpec(MetricName.MaintainerResponsiveness, 0.4);
export const wspec_A4 = new WeightSpec(MetricName.LienseCompatibility, 1.0);
export const wspec_A5 = new WeightSpec(MetricName.VersionDependence, 0.5);
export const wspec_A6 = new WeightSpec(MetricName.PRMergeRestriction, 0.6);

export const WeightSpectSet_A = [wspec_A0, wspec_A1, wspec_A2, wspec_A3, wspec_A4, wspec_A5, wspec_A6];

export const wspec_B0 = new WeightSpec(MetricName.RampUpTime, 0.2);
export const wspec_B1 = new WeightSpec(MetricName.Correctness, 0.4);
export const wspec_B2 = new WeightSpec(MetricName.BusFactor, 0.6);
export const wspec_B3 = new WeightSpec(MetricName.MaintainerResponsiveness, 0.8);
export const wspec_B4 = new WeightSpec(MetricName.LienseCompatibility, 1.0);
export const wspec_B5 = new WeightSpec(MetricName.VersionDependence, 1.2);
export const wspec_B6 = new WeightSpec(MetricName.PRMergeRestriction, 1.4);

export const WeightSpectSet_B = [wspec_B0, wspec_B1, wspec_B2, wspec_B3, wspec_B4, wspec_B5, wspec_B6];

export const wspec_C0 = new WeightSpec(MetricName.RampUpTime, 0.1);
export const wspec_C1 = new WeightSpec(MetricName.Correctness, 0.3);
export const wspec_C2 = new WeightSpec(MetricName.BusFactor, 0.5);
export const wspec_C3 = new WeightSpec(MetricName.MaintainerResponsiveness, 0.7);
export const wspec_C4 = new WeightSpec(MetricName.LienseCompatibility, 1.0);
export const wspec_C5 = new WeightSpec(MetricName.VersionDependence, 0.9);
export const wspec_C6 = new WeightSpec(MetricName.PRMergeRestriction, 1.1);

export const WeightSpectSet_C = [wspec_C0, wspec_C1, wspec_C2, wspec_C3, wspec_C4, wspec_C5, wspec_C6];

export const url_A0 = "https://www.npmjs.com/package/typescript";
export const url_A1 = "https://github.com/msys2/MINGW-packages";
export const url_A2 = "https://www.npmjs.com/package/@docsearch/js";
export const url_A3 = "https://github.com/orangeduck/mpc";

export const urlset_A = [url_A0, url_A1, url_A2, url_A3];

export const url_B0 = "https://www.npmjs.com/package/property-information";
export const url_B1 = "https://www.npmjs.com/package/array-buffer-byte-length";
export const url_B2 = "https://www.npmjs.com/package/@ref-finance/ref-sdk";
export const url_B3 = "https://github.com/DOCGroup/MPC";
export const url_B4 = "https://github.com/google/material-design-lite";

export const urlset_B = [url_B0, url_B1, url_B2, url_B3, url_B4];

export const url_C0 = "https://github.com/torvalds/linux";
export const url_C1 = "https://www.npmjs.com/package/@template-tools/template-sync";
export const url_C2 = "https://www.npmjs.com/package/javadoc";

export const urlset_C = [url_C0, url_C1, url_C2];
