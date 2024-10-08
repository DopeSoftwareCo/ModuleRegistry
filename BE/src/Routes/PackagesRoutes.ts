import { Router } from "express";
import { GetPackagesFromRegistryController } from "../Controllers/GetPackageControllers";
import { GetPackagesRules } from "../Validation/PackagesValidationRules/GetPackagesRules";
import { validateRequest } from "../Validation/validator";

export const PackagesRouter = Router();

// /packages
PackagesRouter.post("/", GetPackagesRules, validateRequest, GetPackagesFromRegistryController);
