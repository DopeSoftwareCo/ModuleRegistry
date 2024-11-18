import PackageModel from "./Package";
import { APIPackageMetaData, APIPackageRating } from "../Types/Models";
import { MongoRatings } from "./PackageSchema";

export type APIPackageData = {
    //folder encoded in base64
    Content?: string;
    URL?: string;
    JSProgram?: string;
    debloat?: boolean;
};

export interface APIPackage {
    metadata: APIPackageMetaData;
    data: APIPackageData;
}

export type Rating = { version: string; scoreset: APIPackageRating };
