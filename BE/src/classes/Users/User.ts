import { Package } from '../../Types/Models';
import { DeleteFromDB } from './DatabaseOps';
import { UDS, MapPermissionStringToUDS, UDS_CODES, PERMISSIONS_UDS } from './Permissions';

export enum Classification {
    Unknown = -1,
    External = 0,
    Internal = 1,
    Administrator = 2,
}

export class User {
    protected readonly uid: string;
    protected readonly email: string;
    protected UDS: UDS;
    protected classification: Classification;

    constructor(uid: string, email: string, permissions: string, classification: Classification) {
        this.uid = uid; // Will be generated
        this.email = email;
        this.UDS = MapPermissionStringToUDS(permissions);
        this.classification = classification;
    }

    SelfDelete(): boolean {
        return DeleteFromDB(this.uid);
    }

    Upload(item: any): boolean {
        // Block operation if user lacks upload permission
        if (!this.UDS.U) {
            return false;
        }

        // Ben's content here
        return true;
    }

    Downlod(packageID: string) {
        // Block operation if user lacks upload permission
        if (!this.UDS.D) {
            return false;
        }

        // functionality goes here
    }

    Search(request: string) {
        // Block operation if user lacks upload permission
        if (!this.UDS.S) {
            return false;
        }

        // functionality goes here
    }

    get Permissions(): UDS {
        return this.UDS;
    }

    get Classification(): Classification {
        return this.classification;
    }

    get Email(): string {
        return this.email;
    }
    get UID(): string {
        return this.uid;
    }
}
