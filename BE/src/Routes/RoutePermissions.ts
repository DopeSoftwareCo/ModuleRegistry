import { ALL_PERMISSIONS, ALLOW_D, ALLOW_S, ALLOW_U, Permission, Role } from "../Classes/Users/UserTypes";

export const JUST_NOT_UNKNOWN = [Role.External, Role.Internal, Role.Admin];

const Permit_PackageDownload = ALLOW_D;
const Permit_Packaeg = ALLOW_U;
const ForPackage_Update = ALLOW_U;
const ForPackage_Ingest = ALLOW_U;
const ForPackage_Search = ALLOW_S;

namespace Op_Perm {
    export const Upload = ALLOW_U;
    export const Download = ALLOW_D;
    export const DeletePackage = [Permission._111];
    export const Search = ALLOW_S;
    export const Ingest = ALLOW_U;
    export const Version = ALLOW_U;
    export const EmptyDatabase = [Permission._111];

    export const Register = [Permission._111];
    export const DeleteUser = [Permission._111];
    export const Update = [Permission._111];
}

namespace Op_Role {
    export const Upload = undefined;
    export const Download = undefined;
    export const DeletePackage = [Role.Admin];
    export const Search = undefined;
    export const Ingest = undefined;
    export const Version = JUST_NOT_UNKNOWN;
    export const EmptyDatabase = [Role.Admin];
    export const Register = [Role.Admin];
    export const DeleteUser = [Role.Admin];
    export const Update = [Role.Admin];
}

export namespace Restriction {
    export const Upload = { perm: Op_Perm.Upload, roles: Op_Role.Upload };
    export const Download = { perm: Op_Perm.Download, roles: Op_Role.Download };
    export const DeletePackage = { perm: Op_Perm.DeletePackage, roles: Op_Role.DeletePackage };
    export const Search = { perm: Op_Perm.Search, roles: Op_Role.Search };
    export const Ingest = { perm: Op_Perm.Ingest, roles: Op_Role.Ingest };
    export const Version = { perm: Op_Perm.Version, roles: Op_Role.Version };
    export const EmptyDatabase = { perm: Op_Perm.EmptyDatabase, roles: Op_Role.EmptyDatabase };
    export const Register = { perm: Op_Perm.Register, roles: Op_Role.Register };
    export const DeleteUser = { perm: Op_Perm.DeleteUser, roles: Op_Role.DeleteUser };
    export const Update = { perm: Op_Perm.Update, roles: Op_Role.Update };
}
