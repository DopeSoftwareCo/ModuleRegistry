import { Classification } from './User';

export function DeleteFromDB(targetUID: string): boolean {
    // functionality here
    return false;
}

export function AddToDB(
    email: string,
    password: string,
    permissions: string,
    classification: Classification
): boolean {
    // Functionality here
    return true;
}
