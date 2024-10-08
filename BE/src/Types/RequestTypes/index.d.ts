import { Request } from "express";
import { IUser } from "../../models/userModel";
import { IComment } from "../../models/commentModel";
import { IPost } from "../../models/postModel";

declare module "requestTypes" {
    export type TestRequestBody = {
        test: string;
    };

    export interface TestRequest extends Request {
        body: TestRequestBody;
    }

    export type GetPackageRequestBody = {
        packages: {
            Version: string;
            Name: string;
        }[];
    };

    export interface GetPackageRequest extends Request {
        body: GetPackageRequestBody;
    }

    export interface ResetRegistryRequest extends Request {}
}
