import { jest, beforeEach, describe, expect, it, beforeAll } from "@jest/globals";
import { Permission, Role } from "../src/Providers/Auth0/UserData";
import { setFakeToken } from "../src/Middleware/ManagementToken";

// Mocking everything by hand, because Jest and GPT are useless

/*const mocked_DeleteAllUsers = async (succeed = true) => {
    return succeed;
};

const mocked_ClearRegistry = async (arg0: string, arg1: string, arg2: string) => {
    return arg0 === "client" && arg1 === "database" && arg2 === "collection";
};

const mocked_Op_SystemReset = async (args: any[]): Promise<string> => {
    const deletedUsers = await mocked_DeleteAllUsers(args[3]);
    const clearedRegistry = await mocked_ClearRegistry(args[0], args[1], args[2]);

    if (!deletedUsers || !clearedRegistry) {
        throw new Error("Invalid input.");
    }
    return "Completed mock call";
};

const validInput = ["client", "database", "collection", true];
const inputToFailDelete = ["client", "database", "collection", false];

describe("System Reset", () => {
    beforeAll(() => {
        setFakeToken();
    });
    it("should have a defined returnVal upon successful execution", async () => {
        expect(
            (await FakeReset.Execute(validInput, Permission._111, Role.Admin)).returnVal
        ).toBeDefined();
    });

    it("should return undefined returnVal if DeleteAllUsers fails during Execute", async () => {
        expect(
            (await FakeReset.Execute(inputToFailDelete, Permission._111, Role.Admin)).returnVal
        ).toBeUndefined();
    });

    it("should return undefined returnVal if ClearAllPackages fails during Execute", async () => {
        expect(
            (await FakeReset.Execute(["", "", "", true], Permission._111, Role.Admin)).returnVal
        ).toBeUndefined();
    });
});

describe("mocked_SystemReset.Execute()", () => {
    beforeAll(() => {
        setFakeToken();
    });
    it("should return UnathorizedCall when VerifyPermission returns false", async () => {
        jest.spyOn(FakeReset, "VerifyPermission").mockReturnValue(false);
        jest.spyOn(FakeReset, "VerifyRole");

        const result = await FakeReset.Execute(validInput, 0 as Permission, 3 as Role);

        expect(result).toEqual(UnathorizedCall);
        expect(result.returnVal).toBeUndefined();
        expect(result.failedToAuthorize).toBe(true);
        expect(result.badInput).toBe(false);
        expect(FakeReset.VerifyPermission).toHaveBeenCalledTimes(1);
        expect(FakeReset.VerifyRole).toHaveBeenCalledTimes(0);
    });

    it("should return UnathorizedCall when VerifyRole returns false", async () => {
        jest.spyOn(FakeReset, "VerifyPermission").mockReturnValue(true);
        jest.spyOn(FakeReset, "VerifyRole").mockReturnValue(false);

        const result = await FakeReset.Execute(validInput, 7 as Permission, 0 as Role);

        expect(result).toEqual(UnathorizedCall);
        expect(result.returnVal).toBeUndefined();
        expect(result.failedToAuthorize).toBe(true);
        expect(result.badInput).toBe(false);
    });

    it("should proceed with Execute if both VerifyPermission and VerifyRole return true", async () => {
        jest.spyOn(FakeReset, "VerifyPermission").mockReturnValue(true);
        jest.spyOn(FakeReset, "VerifyRole").mockReturnValue(true);

        const result = await FakeReset.Execute(validInput, Permission._111, Role.Admin);

        expect(result.returnVal).toBeDefined();
        expect(result.failedToAuthorize).toBe(false);
        expect(result.badInput).toBe(false);
    });
});*/
