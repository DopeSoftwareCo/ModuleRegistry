import * as DSincMath from "../../../DSinc_Modules/DSinc_Math";
import { SubscoreName } from "./ScoreTypes";

export function FindWeightSpecByReceiver(arr: Array<WeightSpec>, x: SubscoreName): number {
    const spec = arr.find(weightSpec => weightSpec.Receiver() === x);
    
    return (spec) ? arr.indexOf(spec,0) : -1; 
}


export class WeightSpec
{ 
    private receiver: SubscoreName; 
    private weightValue: number;

    constructor(nameofTargetSubscore: SubscoreName, weight: number)
    {
        this.receiver = nameofTargetSubscore;
        this.weightValue = DSincMath.ToPositive(weight);
    }

    public Receiver()
    { 
        return this.receiver; 
    }

    public Weight()
    {
        return this.weightValue;
    }
}


export type WeightSpecSet = Array<WeightSpec>;

export const EMPTY_WEIGHTSPEC = new WeightSpec(SubscoreName.Unknown, 0);