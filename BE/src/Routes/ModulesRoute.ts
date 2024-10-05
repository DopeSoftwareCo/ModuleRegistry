import { Router } from "express";
import { ModuleValidationRules } from "../Validation/ModuleValidation/ModuleValidationRules";
import { validateRequest } from "../Validation/validator";
import { AddModuleController } from "../Controllers/Module/ModulesController";

export const ModuleRouter = Router();

ModuleRouter.post("/add", ModuleValidationRules, validateRequest, AddModuleController);
