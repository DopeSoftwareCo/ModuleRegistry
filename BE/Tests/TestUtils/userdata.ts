import { RegistrationInfo } from "../../src/Providers/Auth0/Auth0_DB";
import { Permission, Role } from "../../src/Classes/Users/subdir.const";
// on-db
const jorgeUID = "auth0|6726bfa8ba7c0c3e1bddb02f";
const jorge: RegistrationInfo = {
    email: "JorgePuga@DSinc.com",
    password: "abc123??",
    permission: Permission._111,
    role: Role.Admin,
    username: "JP2024",
};

// on-db
const bellaUID = "auth0|672666803cf3ee6ca06f0783";
const dorian: RegistrationInfo = {
    email: "DBJ@DSinc.com",
    password: "abc123??",
    permission: Permission._111,
    role: Role.Admin,
    username: "PtrPrincess",
};

// on-db
const johnnyUID = "auth0|67267770811352d1f3ee80c1";
const johnny: RegistrationInfo = {
    email: "JLeidy@DSinc.com",
    password: "abc123??",
    permission: Permission._110,
    role: Role.External,
    username: "J-Leidy",
};

//unloaded
const tim: RegistrationInfo = {
    email: "TimCarp@idk.com",
    password: "abc123??",
    permission: Permission._111,
    role: Role.Admin,
    username: "TCarp",
};
const info = [jorge, dorian, johnny];

const DEFAULT_UID: string = "z";
export const default_user: RegistrationInfo = {
    email: "default@DSinc.com",
    password: "correcthorsebatterystaple123(!__+@**(A;DROP TABLE packages",
    permission: Permission._111,
    role: Role.Admin,
    username: "ece30861defaultadminuser",
};
