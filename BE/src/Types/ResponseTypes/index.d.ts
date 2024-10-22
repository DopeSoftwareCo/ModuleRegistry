import { Response } from "express";
import { PackageData, PackageHistoryEntry, PackageMetaData, PackageRating, User } from "../Models";

declare module "ResponseTypes" {
    export type GetPackagesInvalidResponseMessages =
        | "There is missing field(s) in the PackageQuery/AuthenticationToken or it is formatted improperly, or the AuthenticationToken is invalid."
        | "Too many packages returned.";

    export type GetPackagesResponseBody = PackageMetaData[];

    export interface GetPackagesResponse extends Response {
        body: GetPackagesResponseBody;
    }

    export type ResetRegistryResponseMessages =
        | "Registry is reset."
        | "There is missing field(s) in the AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid."
        | "You do not have permission to reset the registry.";

    export type ResetRegistryResponseBody = ResetRegistryResponseMessages;

    export interface ResetRegistryResponse extends Response {
        body: ResetRegistryResponseMessages;
    }

    export type GetPackageViaIDInvalidResponseMessages =
        | "There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid."
        | "Package does not exist.";

    export type GetPackageViaIDResponseBody = {
        metadata: PackageMetadataResponse;
        data: PackageData;
    };

    export interface GetPackageViaIDResponse extends Response {
        body: GetPackageViaIDResponseBody;
    }

    export type UpdatePackageViaIDResponseMessages =
        | "Version is updated."
        | "There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid."
        | "Package does not exist.";

    export interface UpdatePackageViaIDResponse extends Response {}

    export type DeletePackageViaIDResponseMessages =
        | "Package is deleted."
        | "There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid."
        | "Package does not exist.";

    export interface DeletePackageViaIDResponse extends Response {}

    export type UploadInjestResponseMessages =
        | "There is missing field(s) in the PackageData/AuthenticationToken or it is formed improperly (e.g. Content and URL are both set), or the AuthenticationToken is invalid."
        | "Package exists already."
        | "Package is not uploaded due to disqualified rating.";

    export type UploadInjestNewPackageResponseBody = {
        metadata: PackageMetadataResponse;
        data: PackageData;
    };

    export interface UploadInjestNewPackageResponse extends Response {
        body: UploadInjectNewPackageBody;
    }

    export type GetRatingsForPackageResponseBody = PackageRating;

    export type GetRatingsForPackageInvalidResponses =
        | "There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid."
        | "Package does not exist."
        | "The package rating system choked on at least one of the metrics.";

    export interface GetRatingsForPackageResponse extends Response {
        body: GetRatingsForPackageResponseBody;
    }

    //the valid response is a bearer token for the FE, that is missing here.
    export type AuthenticateInvalidResponses =
        | "There are missing field(s) in the AuthenticationRequest or it is formed improperly."
        | "The user or password is invalid."
        | "The system does not support authentication.";

    export interface AuthenticationResponse extends Response {}

    export type GetHistoryOfPackageResponseBody = PackageHistoryEntry;

    export type GetHistoryOfPackageResponseMessages =
        | "There is missing field(s) in the PackageName/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid."
        | "No such package";

    export interface GetHistoryOfPackageRequest extends Response {
        body: GetHistoryOfPackageResponseBody;
    }

    export type DeletePackageByNameResponseMessages =
        | "Package is deleted."
        | "There is missing field(s) in the PackageName/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid."
        | "Package does not exist.";
    export interface DeletePackageByNameResponse extends Response {}

    export type GetPackageViaRegexInvalidResponseMessages =
        | "There is missing field(S) in the PackageRegEx/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid."
        | "No package found under this regex.";

    export type GetPackageViaRegexData = Omit<PackageMetaData, "ID">;
    export interface GetPackageViaRegexResponse extends Response {
        body: GetPackageViaRegexData[];
    }
}
