import { RegistrationInfo } from "../../src/Providers/Auth0/Auth0_DB";
import { Role } from "../../src/Classes/Users/subdir.const";
// on-db
const jorgeUID = "auth0|6726bfa8ba7c0c3e1bddb02f";
const jorge: RegistrationInfo = {
    email: "JorgePuga@DSinc.com",
    password: "abc123??",
    permission: "111",
    roleNum: Role.Admin,
    username: "JP2024",
};

// on-db
const dorian: RegistrationInfo = {
    email: "DBJ@DSinc.com",
    password: "abc123??",
    permission: "101",
    roleNum: Role.Internal,
    username: "PtrPrincess",
};

// on-db
const johnny: RegistrationInfo = {
    email: "JLeidy@DSinc.com",
    password: "abc123??",
    permission: "110",
    roleNum: Role.External,
    username: "J-Leidy",
};

//unloaded
const tim: RegistrationInfo = {
    email: "TimCarp@idk.com",
    password: "abc123??",
    permission: "111",
    roleNum: Role.Admin,
    username: "TCarp",
};
const info = [jorge, dorian, johnny];
