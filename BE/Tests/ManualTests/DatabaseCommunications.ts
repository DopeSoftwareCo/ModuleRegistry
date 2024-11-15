import { Permission, Role } from "../../src/Classes/Users/UserTypes";
import { Auth0_Database } from "../../src/Providers/Auth0/Auth0_DB";
import { Auth0User, RegistrationInfo } from "../../src/Providers/Auth0/Auth0_DB.types";

const DemoUserInfo: RegistrationInfo = {
    email: "DemoUser@domain.net",
    password: "abc123??",
    permission: Permission._000,
    role: Role.External,
    username: "DemoUser",
};

export async function Test_Auth0(deleteUser: boolean = true) {
    console.log("========== [Manual Testing]: Auth0 Communications ==========");

    console.log("***** Testing INSERT ******");
    const uid = await Auth0_Database.INSERT(DemoUserInfo);
    if (!uid) {
        return console.error("Failed to create Demo User. Exiting");
    }
    console.log("Success! Shrek's UID is this: %s", uid);

    console.log("***** Testing UPDATE *****");
    const updated = await Auth0_Database.UPDATE({ uid: uid, username: "Shrek" });
    if (!updated) {
        console.error("Failed to update Shrek.");
    } else {
        console.log("Renamed DemoUser to Shrek");
    }

    console.log("***** Testing LOAD *****");
    const demoUser = await Auth0_Database.LOAD(uid);
    if (!demoUser) {
        console.error("Failed to load Shrek.");
    }
    console.log(demoUser);

    if (!deleteUser) {
        return;
    }
    console.log("***** Testing DELETE *****");
    const deleted = await Auth0_Database.DELETE(uid);

    let delete_message = deleted
        ? "Success! Shrek is banished from the registry"
        : "WARNING: Failed to delete Shrek";
    console.log(delete_message);
}

export function Test_Mongo() {
    console.log("========== [Manual Testing]: MongoDB Communications ==========");
}
