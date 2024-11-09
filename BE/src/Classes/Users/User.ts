import dotenv from "dotenv";
dotenv.config();

import { Auth0_Database } from "../../Providers/Auth0/Auth0_DB";
import { RegistrationInfo, RequestForUserChanges } from "../../Providers/Auth0/Auth0_DB.types";
import { OpUnderRestriction } from "../Ops-Under-Restriction/OpUnderRestriction";
import { Token } from "graphql";
import axios from "axios";
import { LogDebug } from "../../Providers/Utils/Log";
import {
    ALL_PERMISSIONS,
    EditablePackageFields,
    Permission,
    Role,
    UpdatePackageRequest,
} from "./subdir.const";
import { token } from "../../Middleware/ManagementToken";
import {
    MongoClient,
    Filter,
    ObjectId,
    Document,
    UpdateFilter,
    MatchKeysAndValues,
    UpdateResult,
} from "mongodb";
import { AsyncLoops } from "../../DSinc_Modules/DSinc_LoopsMaps";

namespace LocalConst {
    export const roles_upload = [Role.Admin, Role.Internal, Role.External];
    export const exInput_upload = "package";

    // Role: unrestricted
    export const roles_download = undefined;
    export const exInput_download = "uid";

    // Role: unrestricted
    export const roles_search = undefined;
    export const exInput_search = "search criteria";

    export const URI = "uri";
    export const MAIN_DB = "SWEdb";
    export const PACKAGE_COLLECTION_NAME = "Packages";

    export enum UpdateType {
        Major = 0,
        Minor = 1,
        Patch = 2,
    }

    export interface UpdatePackageRequest extends EditablePackageFields {
        ID: ObjectId;
    }

    export interface EditablePackageFields {
        fields: {
            Name?: string;
            Content?: string;
            URL?: string;
            JSProgram?: string;
            debloat?: boolean;
        };
    }

    export const EMPTY_CHANGEREQ: RequestForUserChanges = {
        uid: "uid",
        username: undefined,
        password: undefined,
        role: 0,
        permission: 0,
    };

    export const EMPTY_REGISTRATION: RegistrationInfo = {
        email: "",
        password: "",
        permission: 0,
        role: 0,
        username: "",
    };
}

// ========================= Profile Operations =========================
export namespace User {
    // ========================= Profile-Related Operations =========================
    export const RegisterProfile = new OpUnderRestriction<string | undefined>(
        Auth0_Database.INSERT,
        ALL_PERMISSIONS,
        [Role.Admin],
        LocalConst.EMPTY_REGISTRATION
    );

    export const DeleteProfile = new OpUnderRestriction<boolean>(
        Auth0_Database.DELETE,
        ALL_PERMISSIONS,
        [Role.Admin],
        "some uid"
    );

    export const UpdateProfile = new OpUnderRestriction<boolean>(
        Auth0_Database.UPDATE,
        ALL_PERMISSIONS,
        [Role.Admin],
        LocalConst.EMPTY_CHANGEREQ
    );
}

// ========================= Package-Related Operations =========================
export namespace User {
    // ========================= Unexported, Unrestricted] Package-Related Operations =========================
    async function Upload_Unrestricted(
        submission: EditablePackageFields | EditablePackageFields[]
    ): Promise<boolean> {
        const client = new MongoClient(LocalConst.URI);
        const multiUpload = Array.isArray(submission);

        try {
            client.connect();
            const database = client.db(LocalConst.MAIN_DB);
            const collection = database.collection(LocalConst.PACKAGE_COLLECTION_NAME);

            const result = multiUpload
                ? await collection.insertMany(submission)
                : await collection.insertOne(submission);

            return result.acknowledged;
        } catch (error) {
            LogDebug("A write to the package database failed.");
            return false;
        } finally {
            client.close();
        }
    }

    async function UpdateMany_Unrestricted(requests: UpdatePackageRequest[]): Promise<boolean> {
        const client = new MongoClient(LocalConst.URI);

        try {
            client.connect();
            const database = client.db(LocalConst.MAIN_DB);
            const collection = database.collection(LocalConst.PACKAGE_COLLECTION_NAME);
            let result;
            let acknowledgedCount = 0;

            const promises = requests.map(
                async (value: UpdatePackageRequest, index: number, array: UpdatePackageRequest[]) => {
                    result = await collection.updateOne({ $_id: value.ID }, { $set: value.fields });
                    if (result.acknowledged) {
                        ++acknowledgedCount;
                    }
                }
            );
            await Promise.all(promises);
            return acknowledgedCount == requests.length;
        } catch (error) {
            LogDebug("A package update request failed.");
            return false;
        } finally {
            client.close();
        }
    }

    async function UpdateOne_Unrestricted(request: UpdatePackageRequest): Promise<boolean> {
        const client = new MongoClient(LocalConst.URI);

        try {
            client.connect();
            const database = client.db(LocalConst.MAIN_DB);
            const collection = database.collection(LocalConst.PACKAGE_COLLECTION_NAME);

            const result = await collection.updateOne(
                { _id: request.ID },
                {
                    $set: request.fields,
                }
            );
            return result.acknowledged;
        } catch (error) {
            LogDebug("A write to the package database failed.");
            return false;
        } finally {
            client.close();
        }
    }

    async function RemovePackages(targets: ObjectId | ObjectId[]): Promise<boolean> {
        const client = new MongoClient(LocalConst.URI);
        const multiDelete = Array.isArray(targets);
        const filter: Filter<Document> = {
            _id: targets,
        };

        try {
            client.connect();
            const database = client.db(LocalConst.MAIN_DB);
            const collection = database.collection(LocalConst.PACKAGE_COLLECTION_NAME);
            let result;

            result = multiDelete ? await collection.deleteMany(filter) : await collection.deleteOne(filter);
            return result.acknowledged;
        } catch (error) {
            LogDebug("A deletion from the package database failed.");
            return false;
        } finally {
            client.close();
        }
    }

    async function Downlod_Unrestricted(packageID: string[]): Promise<EditablePackageFields | undefined> {
        try {
            // Ben's content here
        } catch (error) {
            return undefined;
        }
    }
}

// ========================= System-Reset Related Operations =========================
export namespace User {
    // ========================= [Unexported, Unrestricted] Reset Ops =========================
    async function ResetSystem_Unrestricted(args: any[]): Promise<boolean> {
        if (!process.env.MONGODB_URL) {
            throw new Error("Missing env variable MONGO_URL");
        }

        try {
            const deletedAll = await DeleteAllUsers();
            await ClearAllPackages(
                process.env.MONGODB_URL,
                LocalConst.MAIN_DB,
                LocalConst.PACKAGE_COLLECTION_NAME
            );
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
