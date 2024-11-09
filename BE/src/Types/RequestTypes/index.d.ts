import { Request } from "express";
import { AuthenticationRequestModel, PackageData, PackageMetaData } from "../Models";
import { Permission, Role, UpdatePackageRequest } from "../../Classes/Users/subdir.const";
import { RequestForUserChanges } from "../../Providers/Auth0/Auth0_DB.types";

declare module "RequestTypes" {
    export type TestRequestBody = {
        test: string;
    };

    export interface TestRequest extends Request {
        body: TestRequestBody;
    }

    export type GetPackagesData = Omit<PackageMetaData, "ID">;

    export interface GetPackagesRequest extends Request {
        body: GetPackagesData[];
    }

    export interface SystemResetRequest extends Request {
        body: SystemResetRequestBodyl;
    }

    export type SystemResetRequestBody = {
        permission: number;
        role: number;
    };

    export interface ResetRegistryRequest extends Request {}

    export interface GetPackageViaIdRequest extends Request {}

    export type UpdatePackageContentRequestBody = {
        metadata: PackageMetaData;
        data: PackageData;
    };

    export interface UpdatePackageContentRequest extends Request {
        body: UpdatePackageContentRequestBody;
    }

    export type UpdatePackageContentRequestBody = {
        permission: number;
        role: number;
        changeRequests: UpdatePackageRequest | UpdatePackageRequest[];
    };

    export interface VersionPackageRequest extends Request {
        body: VersionPackageRequestBody;
    }

    export interface DeletePackageByIDRequest extends Request {}

    export type UploadInjestPackageRequestBody = PackageData;

    export interface UploadInjestPackageRequest extends Request {
        body: UploadInjestPackageRequestBody;
    }

    export interface GetPackageRatingsRequest extends Request {}

    export interface GetPackageSizeCostRequest extends Request {}

    export type AuthenticationRequestBody = AuthenticationRequestModel;

    export interface AuthenticationRequest extends Request {
        body: AuthenticationRequestBody;
    }

    export interface GetHistoryOfPackageByNameRequest extends Request {}

    export interface DeleteAllVersionsByNameRequest extends Request {}

    export type GetPackagesViaRegexRequestBody = {
        RegEx: string;
    };

    export interface GetPackagesViaRegexRequest extends Request {
        body: GetPackagesViaRegexRequestBody;
    }

    export interface GetPackageByNameRequest extends Request {}

    export interface GetTracks extends Request {}

    export type AddUserRequestBody = {
        username: string;
        email: string;
        password: string;
        permission: number;
        role: number;
    };

    export interface AddUserRequest extends Request {
        body: AddUserRequestBody;
    }

    export type DeleteUserRequestBody = {
        targetID: string;
        permission: number;
        role: number;
    };

    export interface DeleteUserRequest extends Reequest {
        body: DeleteUserRequestBody;
    }

    export type UpdateUserRequestBody = {
        permission: number;
        role: number;
        changeReq: RequestForUserChanges;
    };

    export interface UpdateUserRequest extends Request {
        body: UpdateUserRequestBody;
    }
}
