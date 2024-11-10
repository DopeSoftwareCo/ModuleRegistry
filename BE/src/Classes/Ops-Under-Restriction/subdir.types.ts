export interface Restricted_Return<T> {
    returnVal: T | undefined;
    interpretation: boolean | undefined;
    failedToAuthorize: boolean;
    badInput: boolean;
}
export const BadCallToRestricted: Restricted_Return<any> = {
    returnVal: undefined,
    interpretation: false,
    failedToAuthorize: false,
    badInput: true,
};
export const UnathorizedCall: Restricted_Return<any> = {
    returnVal: undefined,
    interpretation: false,
    failedToAuthorize: true,
    badInput: false,
};

export type Restrictable_Op<Output> = (input?: any) => Output | Promise<Output>;
