import { Router } from "express";
import { ResetControllerDANGER } from "../Controllers/DeleteControllers";
import { ResetRules } from "../Validation/PackageValidationRules/ResetRules";
import { validateRequest } from "../Validation/validator";

export const ResetRouter = Router();
//**DANGEROUS USE WITH CAUTION**
// /reset
ResetRouter.delete("/", ResetRules, validateRequest, ResetControllerDANGER);
