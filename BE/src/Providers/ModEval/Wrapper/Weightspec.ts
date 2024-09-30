const RAMPUP_WEIGHT_DEFAULT = 0.3;
const CORRECTNESS_WEIGHT_DEFAULT = 0.3;
const BUSFACTOR_WEIGHT_DEFAULT = 0.2;
const RESPONSIVENESS_WEIGHT_DEFAULT = 2;

import * as DSinc_Math from "../../../DSinc_Modules/DSinc_Math";

export class Weightspec {
    rampup_weight: number;
    correctness_weight: number;
    busfactor_weight: number;
    response_weight: number;
    license_weight: number;
    unused: number = 0;
    total: number = 0;
    fullweights: number = 0;

    constructor(rampup: number, correctness: number, busfactor: number, responsiveness: number) {
        this.license_weight = 1;

        this.rampup_weight = this.Validate_Weight(rampup);
        this.busfactor_weight = this.Validate_Weight(busfactor);
        this.correctness_weight = this.Validate_Weight(correctness);
        this.response_weight = this.Validate_Weight(responsiveness);

        console.log("Successfully created?:  ");
        console.log(this.Validate_Spec());
    }

    private Validate_Weight(weight: number): number {
        // Don't waste time processing 0
        if (weight == 0) {
            return 0;
        }
        if (weight == 1 || weight == -1) {
            this.unused--;
            this.total++;
            this.fullweights++;
            return 1;
        }

        let posWeight = DSinc_Math.ToPositive(weight);
        let newVal = DSinc_Math.ToDecimalPoint(posWeight, 2);

        this.unused -= newVal;
        this.total += newVal;
        return newVal;
    }

    private Validate_Spec(): boolean {
        if (this.total == 1) {
            return true;
        }
        let scale = 1 / this.total;
        let scaledWeights = [
            this.rampup_weight * scale,
            this.busfactor_weight * scale,
            this.correctness_weight * scale,
            this.response_weight * scale,
        ];

        this.total = 0;
        let index: number,
            greatest: number,
            indexof_greatest = 0;
        scaledWeights.forEach((element) => {
            element = DSinc_Math.ToDecimalPoint(element, 2);
            if (element > greatest) {
                greatest = element;
                indexof_greatest = index;
            }
            this.total += element;
            index++;
        });

        if (this.total < 1.0) {
            // Algebraic proof shows that we will always be able to use
            // "big bank take little bank" to solve this problem

            let compensation = 1.0 - this.total;
            scaledWeights[indexof_greatest] += compensation;
            this.total += compensation;
        } else if (this.total > 1.0) {
            console.log("How did this even happen?? This should be mathematically impossible...");
            return false;
        }

        this.rampup_weight = scaledWeights[0];
        this.busfactor_weight = scaledWeights[1];
        this.correctness_weight = scaledWeights[2];
        this.response_weight = scaledWeights[3];
        return true;
    }
}
