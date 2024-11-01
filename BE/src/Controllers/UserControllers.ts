//update
//add
//delete

import { NextFunction, Response } from "express";
import asyncHandler from "../Middleware/asyncHandler";
import { AddUserRequest, DeleteUserRequest, UpdateUserRequest } from "RequestTypes";
import {
    AddUserResponseMessages,
    DeleteUserResponseMessages,
    UpdateUserResponseMessages,
} from "ResponseTypes";

export const addUserController = asyncHandler(
    async (req: AddUserRequest, res: Response, next: NextFunction) => {
        const userEmail = req.body.email;
        const userUsername = req.body.username;
        const userPassword = req.body.password;
        //use those to create some user here

        //create some variable 'failed' that represents a failure, must be named failed
        let responseMessage: AddUserResponseMessages;
        const failed = false;
        if (!failed) {
            responseMessage = "User added.";
            res.status(200).send(responseMessage);
        } else {
            responseMessage = "Adding user failed.";
            res.status(500).send(responseMessage);
        }
    }
);

export const updateUserController = asyncHandler(
    async (req: UpdateUserRequest, res: Response, next: NextFunction) => {
        const permissions = req.body.permissions;
        //use perms to update perms

        //create some variable 'failed' that represents a failure, must be named failed
        let responseMessage: UpdateUserResponseMessages;
        const failed = false;
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
        const userID = req.body.id;
        const userEmail = req.body.email;
        const userUsername = req.body.username;
        //use these to delete the user from auth0

        //create some variable 'failed' that represents a failure, must be named failed
        let responseMessage: DeleteUserResponseMessages;
        const failed = false;
        if (!failed) {
            responseMessage = "User deleted.";
            res.status(200).send(responseMessage);
        } else {
            responseMessage = "Failed to delete user.";
            res.status(500).send(responseMessage);
        }
    }
);
