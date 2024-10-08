import { Response } from "express";

declare module "ResponseTypes" {
    export type GetPackagesInvalidResponseMessages =
        | "There is missing field(s) in the PackageQuery/AuthenticationToken or it is formatted improperly, or the AuthenticationToken is invalid."
        | "Too many packages returned.";

    export type GetPackagesResponseBody =
        | {
              packages: {
                  Version: string;
                  Name: string;
                  ID: string;
              }[];
          }
        | GetPackagesInvalidResponseMessages;

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
        metadata: {
            Name: string;
            Version: string;
            ID: string;
        };
        data: {
            content: string;
            JSProgram: string;
        };
    };

    export interface GetPackageViaIDResponse extends Response {
        body: GetPackageViaIDResponse;
    }

    export type UpdatePackageViaIDResponse =
        | "Version is updated"
        | "There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid."
        | ("Package does not exist." & Response);

    export type DeletePackageViaIDResponse =
        | "Package is deleted."
        | "There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid."
        | ("Package does not exist." & Response);

    export type UploadInjectResponseMessages =
        | "There is missing field(s) in the PackageData/AuthenticationToken or it is formed improperly (e.g. Content and URL are both set), or the AuthenticationToken is invalid."
        | "Package exists already."
        | "Pacakge is not uploaded due to disqualified rating.";

    export type UploadInjectNewPackageResponseBody = GetPackageViaIDResponseBody;

    export interface UploadInjectNewPackageResponse extends Response {
        body: UploadInjectNewPackageBody | UploadInjectResponseMessages;
    }
}
