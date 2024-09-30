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
}
