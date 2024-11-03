import axios from "axios";
import { Auth0_Database } from "../src/Providers/Auth0/Auth0_DB";
import { expect, jest } from "@jest/globals";
import { beforeEach, describe, it } from "node:test";

// Mock axios for all tests in this file
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Auth0_Database functions", () => {
    const mockUserId = "auth0|user123";
    const mockUserData = {
        id: mockUserId,
        name: "Test User",
        email: "test@example.com",
        username: "testuser",
        metadata: { permission: "101", role: 2 },
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("UPDATE query function", () => {
        const mockUserId = "user123";
        const mockUpdatePayload = { username: "updated_username", permission: "000", role: 0 };

        it("should update a user successfully", async () => {
            mockedAxios.patch.mockResolvedValue({ data: { ...mockUpdatePayload } });

            const result = await Auth0_Database.UPDATE(mockUserId, mockUpdatePayload);

            expect(mockedAxios.patch).toHaveBeenCalledWith(
                `https://your-auth0-domain/api/v2/users/${mockUserId}`,
                mockUpdatePayload,
                expect.anything() // Headers or other configs
            );
            expect(result).toEqual({ ...mockUpdatePayload });
        });

        it("should handle an authorization error", async () => {
            mockedAxios.patch.mockRejectedValue({
                response: { status: 401, data: { message: "Unauthorized" } },
            });

            await expect(Auth0_Database.UPDATE(mockUserId, mockUpdatePayload)).rejects.toThrow(
                "Unauthorized"
            );
        });
    });

    describe("INSERT query function", () => {
        it("should insert a user successfully", async () => {
            mockedAxios.post.mockResolvedValue({ data: { user_id: mockUserId } });

            const result = await Auth0_Database.INSERT({
                email: "test@example.com",
                password: "securepassword123",
                username: "testuser",
                permission: "101",
                roleNum: 2,
            });

            expect(mockedAxios.post).toHaveBeenCalledWith(
                expect.stringContaining("/api/v2/users"),
                expect.objectContaining({
                    email: "test@example.com",
                    password: "securepassword123",
                    username: "testuser",
                    user_metadata: { permission: "101", role: 2 },
                }),
                expect.any(Object) // Headers
            );
            expect(result).toEqual(mockUserId);
        });

        it("should handle an error during user insertion", async () => {
            mockedAxios.post.mockRejectedValue(new Error("Failed to insert user"));

            const result = await Auth0_Database.INSERT({
                email: "test@example.com",
                password: "securepassword123",
                username: "testuser",
                permission: "101",
                roleNum: 2,
            });

            expect(result).toBeUndefined();
        });
    });

    describe("DELETE query function", () => {
        it("should delete a user successfully", async () => {
            mockedAxios.delete.mockResolvedValue({});

            const result = await Auth0_Database.DELETE(mockUserId);

            expect(mockedAxios.delete).toHaveBeenCalledWith(
                expect.stringContaining(`/api/v2/users/${mockUserId}`),
                expect.any(Object) // Headers
            );
            expect(result).toBe(true);
        });

        it("should handle an error during user deletion", async () => {
            mockedAxios.delete.mockRejectedValue(new Error("Failed to delete user"));

            const result = await Auth0_Database.DELETE(mockUserId);

            expect(result).toBe(false);
        });
    });

    describe("LOAD query function", () => {
        it("should load a user successfully", async () => {
            mockedAxios.get.mockResolvedValue({ data: mockUserData });

            const result = await Auth0_Database.LOAD(mockUserId);

            expect(mockedAxios.get).toHaveBeenCalledWith(
                expect.stringContaining(`/api/v2/users/${mockUserId}`),
                expect.any(Object) // Headers
            );
            expect(result).toEqual({
                id: mockUserData.id,
                email: mockUserData.email,
                permission: mockUserData.metadata.permission,
                role: mockUserData.metadata.role,
                username: mockUserData.username,
            });
        });

        it("should handle an error during user loading", async () => {
            mockedAxios.get.mockRejectedValue(new Error("Failed to load user"));

            const result = await Auth0_Database.LOAD(mockUserId);

            expect(result).toBeNull();
        });
    });
});
