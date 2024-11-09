import dotenv from "dotenv";
dotenv.config();

import { MongoClient } from "mongodb";
import { Token } from "graphql";
import axios from "axios";
import { LogDebug } from "../../Providers/Utils/Log";
import { OpUnderRestriction } from "../Ops-Under-Restriction/OpUnderRestriction";
import { Permission, Role } from "./subdir.const";
import { token } from "../../Middleware/ManagementToken";

const DEFAULT_UID = "abc";
const MAIN_DB = "SWEdb";
const MAIN_COLLECTION = "Packages";

// ========================= System-Reset Related Operations =========================
export namespace User {
    // ========================= [Unexported, Unrestricted] Reset Ops =========================
    async function ResetSystem_Unrestricted(args: any[]): Promise<boolean> {
        if (!process.env.MONGODB_URL) {
            throw new Error("Missing env variable MONGO_URL");
        }

        try {
            const deletedAll = await DeleteAllUsers();
            await ClearAllPackages(process.env.MONGODB_URL, MAIN_DB, MAIN_COLLECTION);
            return deletedAll;
        } catch (error) {
            return false;
        }
    }

    // ========================= System Resert Operations =========================
    export async function GetAllUserIDs() {
        const response = await axios.get(`https://YOUR_AUTH0_DOMAIN/api/v2/users`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                fields: "user_id",
                include_fields: true,
                per_page: 100, // Adjust this to fetch more or less per request
            },
        });

        const userIDs = response.data.map((user: { user_id: string }) => user.user_id);
        return userIDs;
    }

    export async function DeleteAllUsers(): Promise<boolean> {
        // Retrieve all user IDs
        const userIDs = await GetAllUserIDs();
        let failures = 0;

        // Delete each user individually
        for (const uid of userIDs) {
            if (uid === DEFAULT_UID) {
                continue;
            }
            try {
                await axios.delete(`https://YOUR_AUTH0_DOMAIN/api/v2/users/${uid}`, {
                    headers: {
                        Authorization: `Bearer ${Token}}`,
                    },
                });
                LogDebug(`Deleted user: ${uid}`);
            } catch (error) {
                LogDebug(`Failed to delete user: ${uid}`);
                ++failures;
            }
        }
        return failures == 0;
    }

    export async function ClearAllPackages(
        uri: string,
        databaseName: string,
        collectionName: string
    ): Promise<void> {
        const client = new MongoClient(uri);

        try {
            await client.connect();
            const database = client.db(databaseName);
            const collection = database.collection(collectionName);
            const size = collection.countDocuments();
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

    export const ResetSystem = new OpUnderRestriction<boolean>(
        ResetSystem_Unrestricted,
        [Permission._111],
        [Role.Admin]
    );
}
