import { Router } from "express";
import { ResetControllerDANGER } from "../Controllers/DeleteControllers";
import { ResetRules } from "../Validation/PackageValidationRules/ResetRules";
import { validateRequest } from "../Validation/validator";
import { verifyToken } from "../Middleware/Auth";

export const ResetRouter = Router();
//**DANGEROUS USE WITH CAUTION**
// /reset
ResetRouter.delete("/", verifyToken, ResetRules, validateRequest, ResetControllerDANGER);
