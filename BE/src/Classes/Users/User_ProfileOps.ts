import { Auth0_Database } from "../../Providers/Auth0/Auth0_DB";
import { RegistrationInfo, RequestForUserChanges } from "../../Providers/Auth0/Auth0_DB.types";
import { OpUnderRestriction } from "../Ops-Under-Restriction/OpUnderRestriction";
import { ALL_PERMISSIONS, Role } from "./subdir.const";

const EMPTY_CHANGEREQ: RequestForUserChanges = {
    uid: "uid",
    username: undefined,
    password: undefined,
    role: 0,
    permission: 0,
};

const EMPTY_REGISTRATION: RegistrationInfo = {
    email: "",
    password: "",
    permission: 0,
    role: 0,
    username: "",
};

// ========================= Profile Operations =========================
export namespace User {
    // ========================= Profile-Related Operations =========================
    export const RegisterProfile = new OpUnderRestriction<string | undefined>(
        Auth0_Database.INSERT,
        ALL_PERMISSIONS,
        [Role.Admin],
        EMPTY_REGISTRATION
    );

    export const DeleteProfile = new OpUnderRestriction<boolean>(
        Auth0_Database.DELETE,
        ALL_PERMISSIONS,
        [Role.Admin],
        "some uid"
    );

    export const UpdateProfile = new OpUnderRestriction<boolean>(
        Auth0_Database.UPDATE,
        ALL_PERMISSIONS,
        [Role.Admin],
        EMPTY_CHANGEREQ
    );
}
