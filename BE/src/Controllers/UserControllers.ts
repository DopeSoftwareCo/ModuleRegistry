import asyncHandler from "../Middleware/asyncHandler";
import { NextFunction, Response } from "express";
import { AddUserRequest, DeleteUserRequest, UpdateUserRequest } from "RequestTypes";
import { Auth0_Database, RegistrationInfo } from "../classes/Users/DatabaseOps";
import { UNKNOWN_ROLE } from "../classes/Users/Roles/subdir.const";
import { UDS_CODES } from "../classes/Users/UDS_Permissions/subdir.const";

const TRUE_NUM = 1;
const FALSE_NUM = 0;

const RETURN_CODES: number[] = [500, 100];

function UpdateResponsePostOp(
    response: Response,
    verdict: boolean,
    fail_message: string,
    success_message: string
) {
    const messages: string[] = [success_message, fail_message];
    const index = verdict ? TRUE_NUM : FALSE_NUM;

    response.status(RETURN_CODES[index]).send(messages[index]);
}

export const addUserController = asyncHandler(
    async (req: AddUserRequest, res: Response, next: NextFunction) => {
        const userEmail = req.body.email;
        const userUsername = req.body.username;
        const userPassword = req.body.password;
        const permission = req.body.permission;
        const role = req.body.role;

        const definedRole = role ? role : UNKNOWN_ROLE.stringFormat;

        const info: RegistrationInfo = {
            email: userEmail,
            password: userPassword,
            permission: permission,
            roleString: definedRole,
            connection: "",
            username: userUsername,
        };

        const result = await Auth0_Database.INSERT(info);
        const failed = result == undefined;
        UpdateResponsePostOp(res, failed, "User added.", "Adding user failed.");
    }
);

export const LoadUserController = asyncHandler(
    async (req: AddUserRequest, res: Response, next: NextFunction) => {
        const userEmail = req.body.email;
        const userUsername = req.body.username;
        const userPassword = req.body.password;
        const permission = req.body.permission;
        const role = req.body.role;

        //use those to create some user here

        const result = await Auth0_Database.LOAD(userEmail);
        const failed = result == undefined;
        UpdateResponsePostOp(res, failed, "Loaded user successfully.", "Loading user failed.");
    }
);

export const updateUserController = asyncHandler(
    async (req: UpdateUserRequest, res: Response, next: NextFunction) => {
        const id = req.body.id;
        const permissions = req.body.permission;
        const definedPerm = permissions ? permissions : UDS_CODES[0];

        const result = await Auth0_Database.UPDATE(id, [definedPerm]);
        const failed = result == undefined;
        UpdateResponsePostOp(res, failed, "User permissions updated.", "User permissions update failed.");
    }
);

export const deleteUserController = asyncHandler(
    async (req: DeleteUserRequest, res: Response, next: NextFunction) => {
        const userID = req.body.id;
        const userEmail = req.body.email;
        const userUsername = req.body.username;

        const failed = await Auth0_Database.DELETE(userID);
        UpdateResponsePostOp(res, failed, "User deleted.", "Failed to delete user.");
    }
);
