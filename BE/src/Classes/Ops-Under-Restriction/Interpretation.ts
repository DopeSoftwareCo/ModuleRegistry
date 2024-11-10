export enum Comparison {
    Equals = 0,
    NOT = 1,
    GT = 2,
    GTE = 3,
    LT = 4,
    LTE = 5,
    Defined = 6,
    Undefined = 7,
}

export function Interpret<Type>(This: Type, as: boolean, when: Comparison, That: Type) {
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
