import { UDS_OBJECTS, UDS } from "./subdir.const";

export function ToUDS(permission: number) {
    return UDS_OBJECTS[permission];
}

export function ToPermissionNumber(uds: UDS): number {
    let level = 0;
    level += uds.U ? 0 : 4;
    level += uds.D ? 0 : 2;
    level += uds.S ? 0 : 1;
    return level;
}
