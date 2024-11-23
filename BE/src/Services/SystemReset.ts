import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { Auth0_Database } from "./AdminUser/Auth0_DB";
const MAIN_DB = "SWEdb";
const MAIN_COLLECTION = "Packages";

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

export async function ResetSystem(): Promise<void> {
    if (!process.env.MONGODB_URL) {
        throw new Error("Missing env variable MONGO_URL");
    }

    try {
        await ClearAllPackages();
        await Auth0_Database.RESET();
    } catch (error) {
        throw error;
    }
}
