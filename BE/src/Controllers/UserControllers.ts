import { NextFunction, Response } from "express";
import { AddUserRequest, DeleteUserRequest, UpdateUserRequest } from "RequestTypes";
import { RegistrationInfo } from "../Providers/Auth0/Auth0_DB.types";
import asyncHandler from "../Middleware/asyncHandler";
import {
    AddUserResponseMessages,
    DeleteUserResponseMessages,
    UpdateUserResponseMessages,
} from "ResponseTypes";
import { User } from "../Classes/Users/User";

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
        const result = await User.RegisterUser.Execute(permission, role, info);
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
        const permission = req.body.permission;
        const role = req.body.role;
        const changeReq = req.body.changeReq;

        let responseMessage: UpdateUserResponseMessages;
        const result = await User.UpdateProfile.Execute(permission, role, changeReq);
        const failed = result == undefined;

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
        const permission = req.body.permission;
        const role = req.body.role;
        const userID = req.body.targetID;

        let responseMessage: DeleteUserResponseMessages;
        const failed = await User.DeleteProfile.Execute(permission, role, userID);

        if (!failed) {
            responseMessage = "User deleted.";
            res.status(200).send(responseMessage);
        } else {
            responseMessage = "Failed to delete user.";
            res.status(500).send(responseMessage);
        }
    }
);
