import * as DSincMath from "../../../DSinc_Modules/DSinc_Math";
import { MetricName } from "./Metric.const";

export class WeightSpec {
    private receiver: MetricName;
    private weightValue: number;

    constructor(nameofTargetSubscore: MetricName, weight: number) {
        this.receiver = nameofTargetSubscore;
        this.weightValue = DSincMath.ToPositive(weight);
    }

    public Receiver(): MetricName {
        return this.receiver;
    }

    public Weight(): number {
        return this.weightValue;
    }
}

export function FindWeightSpecByReceiver(arr: Array<WeightSpec>, name: MetricName): number {
    let size = arr.length;

    for (let i = 0; i < size; i++) {
        if (arr[i].Receiver() === name) {
            return i;
        }
    }
    return -1;
}
