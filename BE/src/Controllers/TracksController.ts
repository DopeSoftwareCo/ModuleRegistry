import { GetTracks } from "RequestTypes";
import asyncHandler from "../Middleware/asyncHandler";
import { GetPlannedTracksResponse } from "ResponseTypes";
import { NextFunction } from "express";

export const GetTracksController = asyncHandler(
    async (req: GetTracks, res: GetPlannedTracksResponse, next: NextFunction) => {
        res.status(200).json({ plannedTracks: ["authorization"] });
    }
);
