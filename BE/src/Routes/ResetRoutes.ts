/**
 * @author John Leidy
 * @description This module is responsible for creating the RESET routes and applying the necessary middelware to them.
 * This ensures when a request object reaches a controller it is properly formatted, the user is authenticated, and all data that is needed is present.
 */
import { Router } from "express";
import { ResetControllerDANGER } from "../Controllers/DeleteControllers";
import { verifyToken } from "../Middleware/Auth";

export const ResetRouter = Router();
//**DANGEROUS USE WITH CAUTION**
// /reset
ResetRouter.delete("/", verifyToken, ResetControllerDANGER);
