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
    GetSizeCostForPackageInvalidResponses,
    GetSizeCostForPackageResponse,
    GetSizeCostForPackageResponseBody,
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
        console.log("original", req.originalUrl);
        console.log("packageid requested", req.params.id);
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
    });

// /package/{id}/cost
export const GetPackageSizeCostViaIDController = asyncHandler(
    async (req: GetPackageSizeCostRequest, res: GetSizeCostForPackageResponse, next: NextFunction) => {
        const requestedPackageID = req.requestedId;
        const dependencyCostRequested = req.query.dependency;

        // Request the package by ID.
        const pack = await PackageModel.findById(requestedPackageID);

        // If the package does not exist, return not found code.
        if (!pack) {
            const responseMessage: GetSizeCostForPackageInvalidResponses = "Package does not exist.";
            return res.status(404).send(responseMessage);
        }

        // Get values from the database (scored already from upload). Ignore total cost
        // for now because its value depends on whether deps were requested or not.
        let totalCost: number;
        let standaloneCost: number = pack.IndividualSizeCost.score_sizeCostStandalone;
        let choked: boolean = false;

        // Determine what totalCost will be. If we do not want dependencies, then total cost is the standalone cost.
        // If we do, then total cost is REALLY the total cost.
        if (dependencyCostRequested) {
            totalCost = pack.TotalSizeCost.score_sizeCostTotal; // with deps
        } else {
            totalCost = standaloneCost; // no deps
        }

        // If dependencies are requested, add the standaloneCost field via spread. We would have total cost be the cost with deps.
        // otherwise, only show the totalCost field (which is really the standalone cost of the package without dependencies).
        const responseBody: GetSizeCostForPackageResponseBody = {
            ...(dependencyCostRequested ? { standaloneCost } : {}),
            totalCost: totalCost,
        };

        if (!choked) {
            res.status(200).json(responseBody);
        } else if (choked) {
            const responseMessage: GetSizeCostForPackageInvalidResponses =
                "The package rating system choked on at least one of the metrics.";
            res.status(500).send(responseMessage);
        }
    }
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
            BusFactor: pack.BusFactor.score_busFactor,
            BusFactorLatency: pack.BusFactor.score_busFactor_latency,
            Correctness: pack.Correctness.score_correctness,
            CorrectnessLatency: pack.Correctness.score_correctness_latency,
            RampUp: pack.RampupTime.rampup_score,
            RampUpLatency: pack.RampupTime.rampup_score_latency,
            ResponsiveMaintainer: pack.Responsiveness.score_responsiveMaintainer,
            ResponsiveMaintainerLatency: pack.Responsiveness.score_responsiveMaintainer_latency,
            LicenseScore: pack.LicenseCompatibility.score_license,
            LicenseScoreLatency: pack.LicenseCompatibility.score_license_latency,
            GoodPinningPractice: pack.GoodPinningPractice.score_goodPinningPractice,
            GoodPinningPracticeLatency: pack.GoodPinningPractice.score_goodPinningPracticeLatency,
            PullRequest: pack.PullRequest.score_pullRequest,
            PullRequestLatency: pack.PullRequest.score_pullRequestLatency,
            NetScore: pack.FinalRating.netscore,
            NetScoreLatency: pack.FinalRating.netscore_latency,
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
        const regex = new RegExp(regexStr, "i"); // case-insensitive regex

        try {
            const packages = await PackageModel.find({
                $or: [{ "metadata.Name": regex }, { "data.Content": regex }],
            });

            if (packages.length === 0) {
                const responseMessage: GetPackageViaRegexInvalidResponseMessages =
                    "No package found under this regex.";
                return res.status(404).send(responseMessage);
            }

            const responseBody: GetPackageViaRegexData[] = packages
                .filter((pack) => pack.metadata && pack.metadata.Version && pack.metadata.Name)
                .map((pack) => ({
                    Version: pack.metadata.Version,
                    Name: pack.metadata.Name,
                    ID: pack._id.toString(),
                }));

            res.status(200).json(responseBody);
        } catch (err) {
            console.error("Error in GetPackagesViaRegexController:", err);
            next(err);
        }
    }
);

//did not add package history controller here, we are not implementing this.
