import { User, Classification } from './User';
import { AddToDB, DeleteFromDB } from './DatabaseOps';

export class Admin extends User {
    constructor(uid: string, email: string) {
        super(uid, email, '111', Classification.Administrator);
    }

    DeleteOtherUser(uid: string) {
        DeleteFromDB(uid);
    }

    Register_User(
        email: string,
        password: string,
        permission: string,
        classification: Classification
    ): User | null {
        // Programmatically put a new user in auth0, resulting in access to the new uid
        const uid = ''; //placeholder
        const user = new User(uid, email, permission, classification);

        return user;
    }

    Register_Admin(email: string, password: string): Admin | null {
        const permissions = '111';
        const classification = Classification.Administrator;
        // Programmatically put a new admin in auth0, resulting in access to the new uid
        AddToDB(email, password, permissions, classification);
        const uid = ''; //placeholder
        return new Admin(uid, email);
    }
}
