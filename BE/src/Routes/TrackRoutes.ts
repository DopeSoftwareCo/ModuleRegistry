/**
 * @author John Leidy
 * @description This module is responsible for creating the track routes and applying the necessary middelware to them.
 * This ensures when a request object reaches a controller it is properly formatted, the user is authenticated, and all data that is needed is present.
 */
import { Router } from "express";
import { GetTracksController } from "../Controllers/TracksController";

export const TracksRouter = Router();

// /tracks
TracksRouter.get("/", GetTracksController);
