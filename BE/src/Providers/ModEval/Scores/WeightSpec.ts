import * as DSincMath from "../../../DSinc_Modules/DSinc_Math";
import { MetricName } from "./Metric.const";

export class WeightSpec {
    private receiver: MetricName;
    private weightValue: number;

    constructor(nameofTargetSubscore: MetricName, weight: number) {
        this.receiver = nameofTargetSubscore;
        this.weightValue = DSincMath.ToPositive(weight);
    }

    public Receiver() {
        return this.receiver;
    }

    public Weight() {
        return this.weightValue;
    }
}

export function FindWeightSpecByReceiver(arr: Array<WeightSpec>, x: MetricName): number {
    const spec = arr.find((weightSpec) => weightSpec.Receiver() === x);

    return spec ? arr.indexOf(spec, 0) : -1;
}
