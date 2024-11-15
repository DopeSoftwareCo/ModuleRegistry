import { NextFunction, Response } from "express";
import { AddUserRequest, DeleteUserRequest, UpdateUserRequest } from "RequestTypes";
import { RegistrationInfo } from "../Providers/Auth0/Auth0_DB.types";
import asyncHandler from "../Middleware/asyncHandler";
import {
    AddUserResponseMessages,
    DeleteUserResponseMessages,
    UpdateUserResponseMessages,
} from "ResponseTypes";
import { Auth0_Database } from "../Providers/Auth0/Auth0_DB";

export const addUserController = asyncHandler(
    async (req: AddUserRequest, res: Response, next: NextFunction) => {
        const userEmail = req.body.email;
        const userUsername = req.body.username;
        const userPassword = req.body.password;
        const permission = req.body.permission;
        const role = req.body.role;

        const info: RegistrationInfo = {
            email: userEmail,
            password: userPassword,
            permission: permission,
            role: role,
            username: userUsername,
        };

        let responseMessage: AddUserResponseMessages;
        const result = await Auth0_Database.INSERT(info);
        const failed = result == undefined;

        if (!failed) {
            responseMessage = "User added.";
            res.status(201).send(responseMessage);
        } else {
            responseMessage = "Adding user failed.";
            res.status(500).send(responseMessage);
        }
    }
);

export const updateUserController = asyncHandler(
    async (req: UpdateUserRequest, res: Response, next: NextFunction) => {
        const newData = req.body;

        let responseMessage: UpdateUserResponseMessages;
        const result = await Auth0_Database.UPDATE(newData);
        const failed = !result;

        if (!failed) {
            responseMessage = "User permissions updated.";
            res.status(200).send(responseMessage);
        } else {
            responseMessage = "User permissions update failed.";
            res.status(500).send(responseMessage);
        }
    }
);

export const deleteUserController = asyncHandler(
    async (req: DeleteUserRequest, res: Response, next: NextFunction) => {
        const user = req.body.id;

        let responseMessage: DeleteUserResponseMessages;
        const result = await Auth0_Database.DELETE(user);
        const failed = !result;

        if (!failed) {
            responseMessage = "User deleted.";
            res.status(200).send(responseMessage);
        } else {
            responseMessage = "Failed to delete user.";
            res.status(500).send(responseMessage);
        }
    }
);
