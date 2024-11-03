export type UDS = {
    U: boolean;
    D: boolean;
    S: boolean;
};

export const UDS_CODES: Array<string> = ['000', '001', '010', '011', '100', '101', '110', '111'];

export const PERMISSIONS_UDS: Array<UDS> = [
    { U: false, D: false, S: false },
    { U: false, D: false, S: true },
    { U: false, D: true, S: false },
    { U: false, D: true, S: true },
    { U: true, D: false, S: false },
    { U: true, D: false, S: true },
    { U: true, D: true, S: false },
    { U: true, D: true, S: true },
];

export function MapPermissionStringToUDS(permissionString: string): UDS {
    let decimalCode = 0;

    if (permissionString.length == 3) {
        const location = UDS_CODES.indexOf(permissionString);
        decimalCode = location >= 0 ? location : 0;
    }

    return PERMISSIONS_UDS[decimalCode];
}
