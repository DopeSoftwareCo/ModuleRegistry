import { NextFunction, Response } from "express";
import asyncHandler from "../../Middleware/asyncHandler";
import { TestRequest } from "RequestTypes";
import PackageModel from "../../Schemas/Package";
import { createRandomPackage } from "../../Services/Packages/MongoDB";

export const TestController = asyncHandler(async (req: TestRequest, res: Response, next: NextFunction) => {
    //trigger merge
    const packages = await PackageModel.find();
    res.status(200).json({ packages });
});
