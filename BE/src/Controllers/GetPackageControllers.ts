import {
    GetPackageRatingsRequest,
    GetPackageSizeCostRequest,
    GetPackagesRequest,
    GetPackagesViaRegexRequest,
    GetPackageViaIdRequest,
} from "RequestTypes";
import asyncHandler from "../Middleware/asyncHandler";
import {
    GetPackagesInvalidResponseMessages,
    GetPackagesResponse,
    GetPackagesResponseBody,
    GetPackageViaIDInvalidResponseMessages,
    GetPackageViaIDResponse,
    GetPackageViaIDResponseBody,
    GetPackageViaRegexData,
    GetPackageViaRegexInvalidResponseMessages,
    GetPackageViaRegexResponse,
    GetRatingsForPackageInvalidResponses,
    GetRatingsForPackageResponse,
    GetRatingsForPackageResponseBody,
    GetSizeCostForPackageResponse,
} from "ResponseTypes";
import { NextFunction } from "express";
import PackageModel from "../Schemas/Package";

// /packages
export const GetPackagesFromRegistryController = asyncHandler(
    async (req: GetPackagesRequest, res: GetPackagesResponse, next: NextFunction) => {
        const requestedPackages = req.body;
        //hover to see types
        //your code here

        //^^^^^^^^^^^^^^^^
        //should return back to here a typed arr like this, this is metadata ab the package
        const responseBody: GetPackagesResponseBody = [
            { Version: "Some version", Name: "Some name", ID: "Some ID" },
            { Version: "Some version", Name: "Some name", ID: "Some ID" },
        ];
        //something to signify too many packages were returned
        const tooManyreturned = false;
        let responseMessage: GetPackagesInvalidResponseMessages;
        if (!tooManyreturned) {
            res.status(200).json(responseBody);
        } else {
            responseMessage = "Too many packages returned.";
            res.status(413).send(responseMessage);
        }
    }
);
// /package/{id}
export const GetPackageViaIDController = asyncHandler(
    async (req: GetPackageViaIdRequest, res: GetPackageViaIDResponse, next: NextFunction) => {
        const requestedPackageID = req.requestedId;
        console.log("original", req.originalUrl);
        //your code here using the id

        //^^^^^^^^^^^^^^^^^^^^^^^^^^
        //return back something that signifies it was not found if that is the case;
        const DNE = false;
        //should return back here something typed as follows
        const responseBody: GetPackageViaIDResponseBody = {
            metadata: {
                Name: "package name",
                Version: "version",
                ID: "id",
            },
            //data is a partial... so we can leave it empty as such if necessary, shouldnt be as we return a 404 if the package does not exist.
            data: {},
        };
        let responseMessage: GetPackageViaIDInvalidResponseMessages;
        if (!DNE) {
            res.status(200).json(responseBody);
        } else {
            responseMessage = "Package does not exist.";
            res.status(404).send(responseMessage);
        }
    }
);

// /package/{id}/cost
export const GetPackageSizeCostViaIDController = asyncHandler(
    async (req: GetPackageSizeCostRequest, res: GetSizeCostForPackageResponse, next: NextFunction) => {}
);

// /package/{id}/rate
export const GetPackageRatingsViaIDController = asyncHandler(
    async (req: GetPackageRatingsRequest, res: GetRatingsForPackageResponse, next: NextFunction) => {
        const requestedPackageID = req.requestedId;

        const pack = await PackageModel.findById(requestedPackageID);
        console.log(pack);

        let DNE = false;

        if (!pack) {
            DNE = true;
            const responseMessage: GetRatingsForPackageInvalidResponses = "Package does not exist.";
            res.status(404).send(responseMessage);
            return;
        }

        const responseBody: GetRatingsForPackageResponseBody = {
            BusFactor: pack!.score_busFactor,
            Correctness: pack!.score_correctness,
            RampUp: pack!.rampup_score,
            ResponsiveMaintainer: pack!.score_responsiveMaintainer,
            LicenseScore: pack!.score_license,
            GoodPinningPractice: pack!.score_goodPinningPractice,
            PullRequest: pack!.score_pullrequest,
            NetScore: pack!.netscore,
        };

        //some return that states the system choked on at least one of the metrics
        const Choked = false;

        if (!Choked) {
            res.status(200).json(responseBody);
        } else if (Choked) {
            const responseMessage: GetRatingsForPackageInvalidResponses =
                "The package rating system choked on at least one of the metrics.";
            res.status(500).send(responseMessage);
        }
    }
);

// /package/byRegEx
export const GetPackagesViaRegexController = asyncHandler(
    async (req: GetPackagesViaRegexRequest, res: GetPackageViaRegexResponse, next: NextFunction) => {
        const regexStr = req.body.RegEx;
        //your code here using the regex str

        //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        //some return of this type as our response body
        const responseBody: GetPackageViaRegexData[] = [
            { Version: "some version", Name: "some name" },
            { Version: "some version", Name: "some name" },
        ];
        //some return that states the package wasnt found via regex
        const DNE = false;
        let responseMessage: GetPackageViaRegexInvalidResponseMessages;
        if (!DNE) {
            res.status(200).json(responseBody);
        } else {
            responseMessage = "No package found under this regex.";
            res.status(404).send(responseMessage);
        }
    }
);

// /package/{}

//did not add package history controller here, we are not implementing this.
