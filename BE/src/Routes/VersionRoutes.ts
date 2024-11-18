import { Router } from "express";
import { verifyToken } from "../Middleware/Auth";
import { VSearchByExactController, VSearchBySimpleRangeController } from "../Controllers/VersionControllers";

export const VersionRouter = Router();

// Go ahead and delete these routers and controllers. Just move
// any necessary logic from the controllers to the search functions themselves or
// repurpose for the GetPackageContllers

VersionRouter.post("/findByExact", verifyToken, VSearchByExactController);

VersionRouter.post("/findBySimpleRange", verifyToken, VSearchBySimpleRangeController);

// Get rid of the package changes before John kills you
