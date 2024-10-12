import { Router } from "express";
import {
    GetPackageRatingsViaIDController,
    GetPackagesViaRegexController,
    GetPackageViaIDController,
} from "../Controllers/GetPackageControllers";
import { UpdatePackageViaIDController } from "../Controllers/UpdatePackageControllers";
import { DeletePackageByIDController } from "../Controllers/DeleteControllers";
import { UploadInjestController } from "../Controllers/UploadInjestControllers";
import { validateRequest } from "../Validation/validator";
import { GeneralViaIDRuleset } from "../Validation/PackageValidationRules/GeneralByIDRules";
import { ByRegexRules } from "../Validation/PackageValidationRules/ByRegexRules";
import { UploadPackageRules } from "../Validation/PackageValidationRules/UploadRules";
import { verifyToken } from "../Middleware/Auth";

export const PackageRouter = Router();

// /package
PackageRouter.post("/", verifyToken, UploadPackageRules, validateRequest, UploadInjestController);
// /package/{id}
PackageRouter.get("/:id", verifyToken, GeneralViaIDRuleset, validateRequest, GetPackageViaIDController);
// /package/{id}
PackageRouter.put("/:id", verifyToken, GeneralViaIDRuleset, validateRequest, UpdatePackageViaIDController);
// /package/{id}
PackageRouter.delete("/:id", verifyToken, GeneralViaIDRuleset, validateRequest, DeletePackageByIDController);
// /package/{id}/rate
PackageRouter.get(
    "/:id/rate",
    verifyToken,
    GeneralViaIDRuleset,
    validateRequest,
    GetPackageRatingsViaIDController
);
// /package/byRegex
PackageRouter.post("/byRegex", verifyToken, ByRegexRules, validateRequest, GetPackagesViaRegexController);
