import { Router } from "express";
import { ResetControllerDANGER } from "../Controllers/DeleteControllers";

export const ResetRouter = Router();
//**DANGEROUS USE WITH CAUTION**
// /reset
ResetRouter.delete("/", ResetControllerDANGER);
