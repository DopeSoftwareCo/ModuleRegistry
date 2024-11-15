import { Router } from "express";
import { verifyToken } from "../Middleware/Auth";
import { VSearchByExactController, VSearchBySimpleRangeController } from "../Controllers/VersionControllers";

export const VersionRouter = Router();

VersionRouter.post("/findByExact", verifyToken, VSearchByExactController);

VersionRouter.post("/findBySimpleRange", verifyToken, VSearchBySimpleRangeController);
