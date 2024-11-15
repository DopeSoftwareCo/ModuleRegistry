import { NextFunction } from "express";
import { VSearchRequest } from "RequestTypes";
import { VSearchResponse, VSearchResponseMessages } from "ResponseTypes";
import asyncHandler from "../Middleware/asyncHandler";
import { SearchVersion } from "../Providers/PackageVersioning/search-functions";

// /packages
export const VSearchByExactController = asyncHandler(
    async (req: VSearchRequest, res: VSearchResponse, next: NextFunction) => {
        const filter = req.body.versions;
        const match = await SearchVersion.ByExact(filter, "");

        let responseMessage: VSearchResponseMessages;
        if (!match) {
            responseMessage = "Invalid request body.";
            return res.status(400).json({ message: responseMessage, data: null });
        } else if (match.length < 1) {
            responseMessage = "No versions of the specified project match the search criteria.";
            return res.status(204).json({ message: responseMessage, data: [] });
        } else {
            responseMessage = "Retrieved version(s).";
            return res.status(200).json({ message: responseMessage, data: match });
        }
    }
);

// /packages
export const VSearchBySimpleRangeController = asyncHandler(
    async (req: VSearchRequest, res: VSearchResponse, next: NextFunction) => {
        const filter = req.body.versions;
        console.log(filter);
        const matches = await SearchVersion.BySimpleRange(filter, "");
        console.log(matches);

        let responseMessage: VSearchResponseMessages;
        if (!matches) {
            responseMessage = "Invalid request body.";
            return res.status(400).json({ message: responseMessage, data: null });
        } else if (matches.length < 1) {
            responseMessage = "No versions of the specified project match the search criteria.";
            return res.status(204).json({ message: responseMessage, data: [] });
        } else {
            responseMessage = "Retrieved version(s).";
            return res.status(200).json({ message: responseMessage, data: matches });
        }
    }
);
