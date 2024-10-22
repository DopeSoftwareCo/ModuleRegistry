import { beforeAll, describe, expect, it, jest } from "@jest/globals";

// verifyToken.test.ts
import request from "supertest";
import express, { Request, Response, NextFunction } from "express";
import { verifyToken, returnProperInvalidResponse } from "../src/Middleware/Auth"; // Adjust the import path
import jwt from "jsonwebtoken";

jest.mock("jsonwebtoken", () => ({
    decode: jest.fn(),
}));

describe("verifyToken Middleware", () => {
    let app: express.Express;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.use((req, res, next) => {
            // Simulating Authorization header for testing
            req.headers.authorization = "Bearer testToken";
            next();
        });
        app.use(verifyToken);
    });

    it("should respond with 400 if invalid URL is accessed", async () => {
        const response = await request(app).get("/packages");
        expect(response.status).toBe(400);
        expect(response.text).toBe(
            "There is missing field(s) in the PackageQuery/AuthenticationToken or it is formatted improperly, or the AuthenticationToken is invalid."
        );
    });

    it("should return 400 for invalid token", async () => {
        // Modify the decode method to return undefined, simulating an invalid token
        (jwt.decode as jest.Mock).mockReturnValue({});

        const response = await request(app).get("/package/somep");
        expect(response.status).toBe(400);
        expect(response.text).toBe(
            "There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid."
        );
    });

    describe("returnProperInvalidResponse", () => {
        it("should send a 400 response for invalid URL", () => {
            const req = {
                originalUrl: "/packages",
                headers: {},
            } as unknown as Request;
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            } as unknown as Response;
            returnProperInvalidResponse(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith(
                "There is missing field(s) in the PackageQuery/AuthenticationToken or it is formatted improperly, or the AuthenticationToken is invalid."
            );
        });
    });
});
