import { Router } from "express";
import { GetPackagesFromRegistryController } from "../Controllers/GetPackageControllers";
import { GetPackagesRules } from "../Validation/PackagesValidationRules/GetPackagesRules";
import { validateRequest } from "../Validation/validator";
import { checkJwt, verifyToken } from "../Middleware/Auth";

export const PackagesRouter = Router();

// /packages
PackagesRouter.post("/", verifyToken, GetPackagesRules, validateRequest, GetPackagesFromRegistryController);
