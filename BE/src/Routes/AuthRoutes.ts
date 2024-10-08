import { Router } from "express";
import { Authcontroller } from "../Controllers/AuthController";

export const AuthRouter = Router();
// /authenticate
AuthRouter.put("/", Authcontroller);
