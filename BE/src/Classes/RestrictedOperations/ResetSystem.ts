import dotenv from "dotenv";
dotenv.config();
import { MongoClient } from "mongodb";
import { GetAllUserIDs } from "../../Services/ResetSystem";
import { Token } from "graphql";
import axios from "axios";
import { LogDebug } from "../../Providers/Utils/Log";
import { RestrictedOp } from "./RestrictedOp";
import { PermissionEnum, Role } from "../Users/subdir.const";
import mongoose from "mongoose";
import { getManagementToken } from "../../Providers/Auth0/ManagementToken";
import { token } from "../../Middleware/ManagementToken";

const DEFAULT_UID = "abc";
const MAIN_DB = "SWEdb";
const MAIN_COLLECTION = "Packages";

const rateLimitEnforcer = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ==================== SYSRESET =====================
export async function DeleteAllUsers(deleteDefaultUser: boolean = false, confirmFullDelete: boolean = false) {
    // Retrieve all user IDs
    const userIDs = await GetAllUserIDs();

    for (const uid of userIDs) {
        if (uid === DEFAULT_UID) {
            if (deleteDefaultUser == false || confirmFullDelete == false) {
                continue;
            }
        }
        try {
            await axios.delete(`https://${process.env.AUTH0_DOMAIN}/api/v2/users/${uid}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            LogDebug(`Deleted user: ${uid}`);
            await rateLimitEnforcer(2000);
        } catch (error) {
            console.error(`Failed to delete user: ${uid}`, error);
        }
    }
}

export async function ClearAllPackages() {
    try {
        if (!mongoose.connection.db) {
            throw new Error("Failed to delete packages");
        }
        const db = mongoose.connection.db;

        const collections = await db?.listCollections().toArray();
        for (const collection of collections) {
            console.log(`Removing: ${collection.name}`);
            await db.dropCollection(collection.name);
        }
        for (const collection of collections) {
            console.log(`Adding: ${collection.name}`);
            await db.createCollection(collection.name);
        }
    } catch (error) {
        console.error("Failed to delete packages:", error);
        throw error;
    }
}

async function RestrictWrapped_ResetSystem(args: any[]) {
    if (!process.env.MONGODB_URL) {
        throw new Error("Missing env variable MONGO_URL");
    }

    try {
        await ClearAllPackages();
        await DeleteAllUsers();
    } catch (error) {
        throw error;
    }
}

export const Restricted_ResetSystem = new RestrictedOp<void>(
    [],
    RestrictWrapped_ResetSystem,
    [PermissionEnum._111],
    [Role.Admin]
);
