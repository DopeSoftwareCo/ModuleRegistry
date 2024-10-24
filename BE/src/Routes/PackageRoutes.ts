/**
 * @author John Leidy
 * @description This module is responsible for creating the package routes and applying the necessary middelware to them.
 * This ensures when a request object reaches a controller it is properly formatted, the user is authenticated, and all data that is needed is present.
 */

import { Router } from "express";
import {
    GetPackageRatingsViaIDController,
    GetPackageSizeCostViaIDController,
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
import { appendMongoDBid } from "../Middleware/MongoDB";
import { DeleteByIDRules } from "../Validation/PackageValidationRules/DeleteByIDRules";
import { GetRatingByIdRules } from "../Validation/PackageValidationRules/GetRatingByIDRules";

export const PackageRouter = Router();

// /package
PackageRouter.post("/", verifyToken, UploadPackageRules, validateRequest, UploadInjestController);
// /package/{id}
PackageRouter.get(
    "/:id",
    verifyToken,
    GeneralViaIDRuleset,
    validateRequest,
    appendMongoDBid,
    GetPackageViaIDController
);
// /package/{id}
PackageRouter.put(
    "/:id",
    verifyToken,
    GeneralViaIDRuleset,
    validateRequest,
    appendMongoDBid,
    UpdatePackageViaIDController
);
// /package/{id}
PackageRouter.delete(
    "/:id",
    verifyToken,
    DeleteByIDRules,
    validateRequest,
    appendMongoDBid,
    DeletePackageByIDController
);
// /package/{id}/rate
PackageRouter.get(
    "/:id/rate",
    verifyToken,
    GetRatingByIdRules,
    validateRequest,
    appendMongoDBid,
    GetPackageRatingsViaIDController
);
// /package/{id}/cost
PackageRouter.get(
    "/:id/cost",
    verifyToken,
    GetRatingByIdRules,
    validateRequest,
    appendMongoDBid,
    GetPackageSizeCostViaIDController
);
// /package/byRegex
PackageRouter.post("/byRegex", verifyToken, ByRegexRules, validateRequest, GetPackagesViaRegexController);
