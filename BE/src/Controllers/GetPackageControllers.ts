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
import { getDownloadPackageInformation, GetPackageBase64 } from "../Services/Packages/Download";
import { VersionPartitons } from "../Services/Packages/Versioning/types";
import { ProcessPackageSearch } from "../Services/Packages/Versioning/search-functions";
import { limitRegexNumbers } from "../Services/Packages/MongoDB";

// Setup all of the search-functions to take GetPackagesData[] as input

export type PageOffset = string | number | undefined;
export type PageData = {
    body: GetPackagesResponseBody;
    nextPageIndex: number;
};

export function SelectResultPage(pages: VersionPartitons, offset: PageOffset): PageData {
    try {
        let index;
        const last = pages.length - 1;

        if (!offset) {
            index = 0;
        } else if (typeof offset === "number") {
            index = offset;
        } else {
            index = parseInt(offset);
        }

        // Use a round-robin approach to page indexing, since there is no option to return undefined / null
        const adjacent = index + 1;
        const next = adjacent < last ? adjacent : 0;
        const page = pages[index];

        return {
            body: page ? page : [],
            nextPageIndex: next,
        };
    } catch {
        return {
            // If any error occurs, return page 0
            body: pages[0] ? pages[0] : [],
            nextPageIndex: 0,
        };
    }
}

// /packages
export const GetPackagesFromRegistryController = asyncHandler(
    async (req: GetPackagesRequest, res: GetPackagesResponse, next: NextFunction) => {
        //BEWARE: There is a case where there will be ONE ITEM in the array
        // This object will be requesting for ALL packages
        // all responses/requests should be paginated
        // An example below,
        const requestedPackages = req.body;
        const offset: PageOffset =
            req.query.offset === "undefined" || req.query.offset === "string" || req.query.offset === "number"
                ? req.query.offset
                : undefined;

        const result = await ProcessPackageSearch(requestedPackages);
        const pages: VersionPartitons = result.dataPartitions;
        const selectedPage = SelectResultPage(pages, offset);
        const responseBody: GetPackagesResponseBody = selectedPage.body;
        let responseMessage: GetPackagesInvalidResponseMessages;

        if (responseBody.length < 100) {
            console.log(`/packages: ${JSON.stringify(responseBody)}`);
            res.status(200).json(responseBody);
        } else {
            responseMessage = "Too many packages returned.";
            console.log(`/packages: ${responseMessage}`);
            res.status(413).send(responseMessage);
        }
    }
);

// /package/{id}
export const GetPackageViaIDController = asyncHandler(
    async (req: GetPackageViaIdRequest, res: GetPackageViaIDResponse, next: NextFunction) => {
        const packID = req.params.id;
        //your code here using the id
        console.log("mime?  ", req.headers["includemime"]);
        const includeMIME = req.headers["includemime"] ? true : false;
        console.log(`/package/id    requested ID: ${packID}`);
        console.log("Getting package base64 in getpackage via id");
        const result = GetPackageBase64(packID, includeMIME);
        console.log("obtained base 64");
        const downloadMetadata = await getDownloadPackageInformation(packID);
        console.log("Getting metadata");
        //should return back here something typed as follows
        console.log("Building response");
        const responseBody: GetPackageViaIDResponseBody = {
            metadata: downloadMetadata,
            //data is a partial... so we can leave it empty as such if necessary, shouldnt be as we return a 404 if the package does not exist.
            data: {
                Content: result,
            },
        };
        let responseMessage: GetPackageViaIDInvalidResponseMessages;
        if (result) {
            console.log(`/packages/{id}: ${JSON.stringify(responseBody)}`);
            res.status(200).json(responseBody);
        } else {
            responseMessage = "Package does not exist.";
            console.log(`/packages/{id}: ${responseMessage}`);
            res.status(404).send(responseMessage);
        }
    }
);

// /package/{id}/cost
export const GetPackageSizeCostViaIDController = asyncHandler(
    async (req: GetPackageSizeCostRequest, res: GetSizeCostForPackageResponse, next: NextFunction) => {
        const requestedPackageID = req.requestedId;
        const dependencyCostRequested = req.query.dependency;
        console.log(`/package/id/cost   id requested: ${requestedPackageID}`);
        // Request the package by ID.
        const pack = await PackageModel.findById(requestedPackageID);

        if (!requestedPackageID) {
            const responseMessage: GetSizeCostForPackageInvalidResponses =
                "There is missing field(s) in the PackageID";
            return res.status(400).send(responseMessage);
        }

        // If the package does not exist, return not found code.
        if (!pack) {
            const responseMessage: GetSizeCostForPackageInvalidResponses = "Package does not exist.";
            console.log(`/package/{id}/cost: ${responseMessage}`);
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
            [requestedPackageID]: {
                ...(dependencyCostRequested ? { standaloneCost } : {}),
                totalCost: totalCost,
            },
        };

        if (!choked) {
            console.log(`/package/{id}/cost: ${JSON.stringify(responseBody)}`);
            res.status(200).json(responseBody);
        } else if (choked) {
            const responseMessage: GetSizeCostForPackageInvalidResponses =
                "The package rating system choked on at least one of the metrics.";
            console.log(`/package/{id}/cost: ${responseMessage}`);
            res.status(500).send(responseMessage);
        }
    }
);

// /package/{id}/rate
export const GetPackageRatingsViaIDController = asyncHandler(
    async (req: GetPackageRatingsRequest, res: GetRatingsForPackageResponse, next: NextFunction) => {
        const requestedPackageID = req.requestedId;

        console.log(`/package/id/rate   id requested: ${requestedPackageID}`);

        const pack = await PackageModel.findById(requestedPackageID);

        let DNE = false;

        if (!pack) {
            DNE = true;
            const responseMessage: GetRatingsForPackageInvalidResponses = "Package does not exist.";
            console.log("/package/{id}/rate", responseMessage);
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
            console.log(`/package/{id}/rate: ${JSON.stringify(responseBody)}`);
            res.status(200).json(responseBody);
        } else if (Choked) {
            const responseMessage: GetRatingsForPackageInvalidResponses =
                "The package rating system choked on at least one of the metrics.";
            console.log(`/package/{id}/rate: ${responseMessage}`);
            res.status(500).send(responseMessage);
        }
    }
);

// /package/byRegEx

export const GetPackagesViaRegexController = asyncHandler(
    async (req: GetPackagesViaRegexRequest, res: GetPackageViaRegexResponse, next: NextFunction) => {
        const regexStr = limitRegexNumbers(req.body.RegEx);
        const regex = new RegExp(regexStr, "i"); // case-insensitive regex

        try {
            const packages = await PackageModel.find({
                $or: [{ "metadata.Name": regex }, { "data.Content": regex }],
            });

            if (packages.length === 0) {
                const responseMessage: GetPackageViaRegexInvalidResponseMessages =
                    "No package found under this regex.";
                console.log(`/package/byRegex: ${responseMessage}`);
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
            const responseMessage: GetPackageViaRegexInvalidResponseMessages =
                "No package found under this regex.";
            console.log(`/package/byRegex: ${responseMessage}`);
            return res.status(404).send(responseMessage);
        }
    }
);

//did not add package history controller here, we are not implementing this.
