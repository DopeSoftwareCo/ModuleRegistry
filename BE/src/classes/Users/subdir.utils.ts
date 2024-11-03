import { UDS_OBJECTS, UDS, UDS_CODES } from "./subdir.const";

export function PermissionStringToUDS(permissionString: string): UDS {
    let decimalCode = 0;

    if (permissionString.length == 3) {
        const location = UDS_CODES.indexOf(permissionString);
        decimalCode = location >= 0 ? location : 0;
    }

    return UDS_OBJECTS[decimalCode];
}

export function UDSToString(uds: UDS): number {
    let level = 0;
    level += uds.U ? 0 : 4;
    level += uds.D ? 0 : 2;
    level += uds.S ? 0 : 1;
    return level;
}
