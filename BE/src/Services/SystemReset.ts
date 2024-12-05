import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { Auth0_Database } from "./AdminUser/Auth0_DB";
import * as fs from "fs/promises";
import * as path from "path";

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

export const removePackages = async () => {
    try {
        const directory = "../../Data/Packages";
        const files = await fs.readdir(directory);

        for (const file of files) {
            const filePath = path.join(directory, file);
            const stat = await fs.lstat(filePath);
            if (stat.isFile()) {
                await fs.unlink(filePath);
                console.log(`Deleted file: ${filePath}`);
            }
            if (stat.isDirectory()) {
                await fs.rmdir(filePath, { recursive: true });
                console.log(`Deleted folder: ${filePath}`);
            }
        }

        console.log(`All files in ${directory} have been removed.`);
    } catch (error) {
        console.error(`Error while removing files: ${error}`);
    }
};

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
