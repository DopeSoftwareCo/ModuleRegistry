import { Router } from "express";
import {
    GetPackageRatingsViaIDController,
    GetPackagesViaRegexController,
    GetPackageViaIDController,
} from "../Controllers/GetPackageControllers";
import { UpdatePackageViaIDController } from "../Controllers/UpdatePackageControllers";
import { DeletePackageByIDController, DeletePackageByNameController } from "../Controllers/DeleteControllers";
import { UploadInjestController } from "../Controllers/UploadInjestControllers";

export const PackageRouter = Router();

// /package
PackageRouter.post("/", UploadInjestController);
// /package/{id}
PackageRouter.get("/:id", GetPackageViaIDController);
// /package/{id}
PackageRouter.put("/:id", UpdatePackageViaIDController);
// /package/{id}
PackageRouter.delete("/:id", DeletePackageByIDController);
// /package/{id}/rate
PackageRouter.get("/:id/rate", GetPackageRatingsViaIDController);
//not baseline, deletes all versions of packages by name
// /package/byName/{name}
PackageRouter.delete("/byName/:name", DeletePackageByNameController);
PackageRouter.post("/byRegex", GetPackagesViaRegexController);
