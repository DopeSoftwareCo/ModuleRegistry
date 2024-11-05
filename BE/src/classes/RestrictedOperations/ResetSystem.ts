import dotenv from "dotenv";
dotenv.config();
import { MongoClient } from "mongodb";
import { GetAllUserIDs } from "../../Services/ResetSystem";
import { Token } from "graphql";
import axios from "axios";
import { LogDebug } from "../../Providers/Utils/Log";
import { RestrictedOp } from "./RestrictedOp";
import { Permission, Role } from "../Users/subdir.const";

const DEFAULT_UID = "abc";
const MAIN_DB = "SWEdb";
const MAIN_COLLECTION = "Packages";

// ==================== SYSRESET =====================
export async function DeleteAllUsers(deleteDefaultUser: boolean = false, confirmFullDelete: boolean = false) {
    // Retrieve all user IDs
    const userIDs = await GetAllUserIDs();

    // Delete each user individually
    for (const uid of userIDs) {
        if (uid === DEFAULT_UID) {
            if (deleteDefaultUser == false || confirmFullDelete == false) {
                continue;
            }
        }
        try {
            await axios.delete(`https://YOUR_AUTH0_DOMAIN/api/v2/users/${uid}`, {
                headers: {
                    Authorization: `Bearer ${Token}}`,
                },
            });
            LogDebug(`Deleted user: ${uid}`);
        } catch (error) {
            console.error(`Failed to delete user: ${uid}`, error);
        }
    }
}

export async function ClearAllPackages(uri: string, databaseName: string, collectionName: string) {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db(databaseName);
        const collection = database.collection(collectionName);

        // Retrieve all package IDs
        const packages = await collection.find({}, { projection: { packageID: 1, _id: 0 } }).toArray();
        const packageIDs = packages.map((pkg) => pkg.packageID);

        // Delete all packages with those IDs
        const deleteResult = await collection.deleteMany({ packageID: { $in: packageIDs } });

        console.log(`Deleted ${deleteResult.deletedCount} packages.`);
    } catch (error) {
        console.error("Failed to delete packages:", error);
        throw error;
    } finally {
        await client.close();
    }
}

async function RestrictWrapped_ResetSystem(args: any[]) {
    if (!process.env.MONGODB_URL) {
        throw new Error("Missing env variable MONGO_URL");
    }

    try {
        await DeleteAllUsers();
        await ClearAllPackages(process.env.MONGODB_URL, MAIN_DB, MAIN_COLLECTION);
    } catch (error) {
        throw error;
    }
}

export const Restricted_ResetSystem = new RestrictedOp<void>(
    [],
    RestrictWrapped_ResetSystem,
    [Permission._111],
    [Role.Admin]
);
