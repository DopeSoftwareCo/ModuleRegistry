
export function ToPositive(x: number): number
{
    if (x >= 0) { return x;}

    let positive = (x * x) / x;
    return positive;
}


export function ToDecimalPoint(x: number, precision: number): number
{
    let decimalOnly = x - Math.floor(x);
    return parseFloat(x.toPrecision(precision));
}


export const equalFloat = (a: number, b: number, epsilon: number = 0.001): boolean => {
    return Math.abs(a - b) < epsilon;
};
