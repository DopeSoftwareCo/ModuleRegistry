import { NextFunction, Response } from "express";
import asyncHandler from "../../Middleware/asyncHandler";
import { AddModuleRequest } from "RequestTypes";
import { AddModuleResponse } from "ResponseTypes";
import { AddModule } from "../../Services/Module/ModulesService";

export const AddModuleController = asyncHandler(
    async (req: AddModuleRequest, res: AddModuleResponse, next: NextFunction) => {
        const addModuleResult = await AddModule(req);
        if (!addModuleResult.error) {
            res.status(201).json(addModuleResult);
        } else if (addModuleResult.error) {
            res.status(500).json(addModuleResult);
        } else {
            res.status(500).json({ message: "a really bad error occured... no idea." });
        }
    }
);
