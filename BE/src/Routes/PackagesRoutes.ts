import { Router } from "express";
import { GetPackagesFromRegistryController } from "../Controllers/GetPackageControllers";

export const PackagesRouter = Router();

// /packages
PackagesRouter.post("/", GetPackagesFromRegistryController);
