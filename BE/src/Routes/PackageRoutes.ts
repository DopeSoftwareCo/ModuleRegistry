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

export const PackageRouter = Router();

// /package
PackageRouter.post("/", UploadPackageRules, validateRequest, UploadInjestController);
// /package/{id}
PackageRouter.get("/:id", GeneralViaIDRuleset, validateRequest, GetPackageViaIDController);
// /package/{id}
PackageRouter.put("/:id", GeneralViaIDRuleset, validateRequest, UpdatePackageViaIDController);
// /package/{id}
PackageRouter.delete("/:id", GeneralViaIDRuleset, validateRequest, DeletePackageByIDController);
// /package/{id}/rate
PackageRouter.get("/:id/rate", GeneralViaIDRuleset, validateRequest, GetPackageRatingsViaIDController);
// /package/byRegex
PackageRouter.post("/byRegex", ByRegexRules, validateRequest, GetPackagesViaRegexController);
