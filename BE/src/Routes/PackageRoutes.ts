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
import { appendMongoDBid } from "../Middleware/MongoDB";
import { DeleteByIDRules } from "../Validation/PackageValidationRules/DeleteByIDRules";

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
    GeneralViaIDRuleset,
    validateRequest,
    appendMongoDBid,
    GetPackageRatingsViaIDController
);
// /package/byRegex
PackageRouter.post("/byRegex", verifyToken, ByRegexRules, validateRequest, GetPackagesViaRegexController);
