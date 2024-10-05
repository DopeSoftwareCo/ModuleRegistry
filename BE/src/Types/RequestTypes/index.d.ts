import { Request } from "express";
import { IUser } from "../../models/userModel";
import { IComment } from "../../models/commentModel";
import { IPost } from "../../models/postModel";

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
