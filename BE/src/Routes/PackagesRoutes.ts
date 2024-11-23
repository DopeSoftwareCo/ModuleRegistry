/**
 * @author John Leidy
 * @description This module is responsible for creating the packages routes and applying the necessary middelware to them.
 * This ensures when a request object reaches a controller it is properly formatted, the user is authenticated, and all data that is needed is present.
 */
import { Router } from "express";
import { GetPackagesFromRegistryController } from "../Controllers/GetPackageControllers";
import { GetPackagesRules } from "../Validation/PackagesValidationRules/GetPackagesRules";
import { validateRequest } from "../Validation/validator";
import { checkJwt, verifyToken } from "../Middleware/Auth";
import { permRestrictionMiddleware } from "../Middleware/PermRestrictor";
import { SearchPerms } from "../Services/AdminUser/UserData";

export const PackagesRouter = Router();

// /packages
PackagesRouter.post(
    "/",
    verifyToken,
    permRestrictionMiddleware(SearchPerms, []),
    GetPackagesRules,
    validateRequest,
    GetPackagesFromRegistryController
);
