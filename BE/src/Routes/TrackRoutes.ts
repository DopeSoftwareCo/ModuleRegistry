import { Router } from "express";
import { GetTracksController } from "../Controllers/TracksController";

export const TracksRouter = Router();

// /tracks
TracksRouter.get("/", GetTracksController);
