import { Router } from "express";
import { ResetControllerDANGER } from "../Controllers/DeleteControllers";
import { verifyToken } from "../Middleware/Auth";

export const ResetRouter = Router();
//**DANGEROUS USE WITH CAUTION**
// /reset
ResetRouter.delete("/", verifyToken, ResetControllerDANGER);
