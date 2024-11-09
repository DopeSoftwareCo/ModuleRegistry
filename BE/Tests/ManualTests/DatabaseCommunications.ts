import { Permission, Role } from "../../src/Classes/Users/subdir.const";
import { User } from "../../src/Classes/Users/User";
import { Auth0_Database } from "../../src/Providers/Auth0/Auth0_DB";
import { Auth0User, RegistrationInfo } from "../../src/Providers/Auth0/Auth0_DB.types";

const DemoUserInfo: RegistrationInfo = {
    email: "DemoUser@domain.net",
    password: "abc123??",
    permission: Permission._000,
    role: Role.External,
    username: "DemoUser",
};

function FailDemo(message: string): void {
    console.error(message);
}

export async function Test_Auth0() {
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

    console.log("***** Testing SELECT UID *****");
    const all_uids = await Auth0_Database.SELECT_UID();
    if (!all_uids) {
        return console.error("Failed to retrieve users. Exiting");
    }
    const select_message = all_uids
        ? all_uids.includes(uid)
            ? uid
            : "Failed to SELECT Shrek."
        : "Failed to SELECT Shrek";
    console.log(select_message);
    console.log(all_uids);

    console.log("***** Testing DELETE *****");
    const deleted = await Auth0_Database.DELETE(uid);
    const delete_message = deleted
        ? all_uids
            ? "Success! Shrek is banished from the registry"
            : "I can't delete something that does not exist on the database"
        : "WARNING: Failed to delete Shrek.";
    console.log(delete_message);
}

export function Test_Mongo() {
    console.log("========== [Manual Testing]: MongoDB Communications ==========");
}
