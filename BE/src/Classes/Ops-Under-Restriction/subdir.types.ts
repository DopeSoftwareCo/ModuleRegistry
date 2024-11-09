export interface Restricted_Return<T> {
    returnVal: T | undefined;
    failedToAuthorize: boolean;
    badInput: boolean;
}
export const BadCallToRestricted: Restricted_Return<any> = {
    returnVal: undefined,
    failedToAuthorize: false,
    badInput: true,
};
export const UnathorizedCall: Restricted_Return<any> = {
    returnVal: undefined,
    failedToAuthorize: true,
    badInput: false,
};

export type Restrictable_Op<Output> = (input?: any) => Output | Promise<Output>;
