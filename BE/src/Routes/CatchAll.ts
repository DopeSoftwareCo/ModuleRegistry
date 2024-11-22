import { Router } from "express";

export const CatchAllRouter = Router();

CatchAllRouter.all("*", (req, res) => {
    res.status(404).send("ROUTE NOT FOUND, PLEASE CONSULT THE YAML");
});
