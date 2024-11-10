export enum Comparison {
    Equals = 0,
    NOT = 1,
    GT = 2,
    GTE = 3,
    LT = 4,
    LTE = 5,
    Defined = 6,
    Undefined = 7,
    Satisfies_ArrayLengthComparison = 8,
    Satisfies_ArrayNotEmpty = 9,
}

export function Interpret<Type>(This: Type, as: boolean, when: Comparison, That: any, SecondaryWhen?: any) {
    let interpretation: boolean;
    switch (when) {
        case Comparison.Equals:
            interpretation = When_Equals<Type>(This, as, That);
            break;
        case Comparison.NOT:
            interpretation = When_NOT<Type>(This, as, That);
            break;
        case Comparison.GT:
            interpretation = When_GreaterThan<Type>(This, as, That);
            break;
        case Comparison.GTE:
            interpretation = When_GTE<Type>(This, as, That);
            break;
        case Comparison.Equals:
            interpretation = When_LessThan<Type>(This, as, That);
            break;
        case Comparison.Equals:
            interpretation = When_LTE<Type>(This, as, That);
            break;
        case Comparison.Equals:
            interpretation = When_Defined(This, as);
            break;
        case Comparison.Undefined:
            interpretation = When_Undefined(This, as);
            break;
        case Comparison.Satisfies_ArrayNotEmpty:
            interpretation = When_ArrayNotEmpty(This, as);
        case Comparison.Satisfies_ArrayLengthComparison:
            interpretation = When_ArrayLength(This, as, SecondaryWhen, That);
        default:
            interpretation = false;
    }
    return interpretation;
}

function When_Equals<Type>(This: Type, as: boolean, That: Type): boolean {
    const verdict = This == That ? as : !as;
    return verdict;
}

function When_NOT<Type>(This: Type, as: boolean, That: Type): boolean {
    const verdict = This != That ? as : !as;
    return verdict;
}

function When_GreaterThan<Type>(This: Type, as: boolean, That: Type): boolean {
    const verdict = This > That ? as : !as;
    return verdict;
}

function When_GTE<Type>(This: Type, as: boolean, That: Type): boolean {
    const verdict = This >= That ? as : !as;
    return verdict;
}

function When_LessThan<Type>(This: Type, as: boolean, That: Type): boolean {
    const verdict = This < That ? as : !as;
    return verdict;
}

function When_LTE<Type>(This: Type, as: boolean, That: Type): boolean {
    const verdict = This <= That ? as : !as;
    return verdict;
}

function When_Defined(This: any, as: boolean): boolean {
    const verdict = This != undefined ? as : !as;
    return verdict;
}

function When_Undefined(This: any, as: boolean): boolean {
    const verdict = This == undefined ? as : !as;
    return verdict;
}

function When_ArrayNotEmpty(This: any, as: boolean): boolean {
    const verdict = This.length > 0 ? as : !as;
    return verdict;
}

function When_ArrayLength(This: any, as: boolean, when: Comparison, That: number) {
    if (when == Comparison.Satisfies_ArrayLengthComparison) {
        return false;
    }
    return Interpret<number>(This.length, as, when, That);
}
