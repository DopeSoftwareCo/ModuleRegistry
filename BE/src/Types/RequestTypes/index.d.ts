import { Request } from "express";
import { AuthenticationRequestModel, PackageData, PackageMetaData } from "../Models";

declare module "RequestTypes" {
    export type TestRequestBody = {
        test: string;
    };

    export interface TestRequest extends Request {
        body: TestRequestBody;
    }

    export type AddModuleRequestBody = {
        url: string;
        repoName?: string;
        repoOwner?: string;
    };

    export interface AddModuleRequest extends Request {
        body: AddModuleRequestBody;
    }
}
