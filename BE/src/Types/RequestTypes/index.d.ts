import { Request } from "express";
import { APIAuthenticationRequestModel, APIPackageData, APIPackageMetaData } from "../Models";
import { Permission, Role, UpdatePackageRequest } from "../../Classes/Users/UserTypes";
import { UpdateUserRequest_DevFriendly } from "../../Providers/Auth0/Auth0_DB.types";

import { Request } from "express";
import { APIAuthenticationRequestModel, APIPackageData, APIPackageMetaData } from "../Models";

declare module "RequestTypes" {
    export type TestRequestBody = {
        test: string;
    };

    export interface TestRequest extends Request {
        body: TestRequestBody;
    }

    export type GetPackagesData = Omit<APIPackageMetaData, "ID">;

    export interface GetPackagesRequest extends Request {
        body: GetPackagesData[];
    }

    export interface ResetRegistryRequest extends Request {}

    export interface GetPackageViaIdRequest extends Request {}

    export type UpdatePackageContentRequestBody = {
        metadata: APIPackageMetaData;
        data: APIPackageData;
    };

    export interface UpdatePackageContentRequest extends Request {
        body: UpdatePackageContentRequestBody;
    }

    export interface DeletePackageByIDRequest extends Request {}

    export type UploadInjestPackageRequestBody = APIPackageData;

    export interface UploadInjestPackageRequest extends Request {
        body: UploadInjestPackageRequestBody;
    }

    export interface GetPackageRatingsRequest extends Request {}

    export interface GetPackageSizeCostRequest extends Request {}

    export type AuthenticationRequestBody = APIAuthenticationRequestModel;

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
        id: string;
    };

    export interface DeleteUserRequest extends Reequest {
        body: DeleteUserRequestBody;
    }

    export type UpdateUserRequestBody = {
        uid: string;
        username?: string;
        password?: string;
        permission?: number;
        role?: number;
    };

    export interface UpdateUserRequest extends Request {
        body: UpdateUserRequestBody;
    }

    export type VSearchRequestBody = {
        versions: string;
    };

    export interface VSearchRequest extends Request {
        body: VSearchRequestBody;
    }
}
