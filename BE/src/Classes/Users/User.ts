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
    ALL_ROLES,
    ALLOW_D,
    ALLOW_S,
    ALLOW_U,
    DEFAULT_UID,
    EditablePackageFields,
    Permission,
    RegistrySearchResult,
    Role,
    SearchQuery_ByCarat,
    SearchQuery_ByRange,
    SearchQuery_ByRegex,
    SearchQuery_ByTilde,
    UpdatePackageRequest,
} from "./subdir.const";
import { MongoClient, Filter, ObjectId, Document, FindCursor } from "mongodb";
import { Package, PackageMetaData } from "../../Types/Models";

const auth0Domain = process.env.AUTH0_DOMAIN;

export const URI = "uri";
export const MAIN_DB = "SWEdb";
export const PACKAGE_COLLECTION_NAME = "Packages";

namespace ExInput {
    export const packageDownload = "uid";
    export const packageSearch = "search criteria";
    export const packageUpload: EditablePackageFields | EditablePackageFields[] = [];
    export const packageVersioning: UpdatePackageRequest | UpdatePackageRequest[] = [];
    export const packageRemoval: ObjectId | ObjectId[] = [];

    export const empty_changeReq: RequestForUserChanges = {
        uid: "uid",
        username: undefined,
        password: undefined,
        role: 0,
        permission: 0,
    };

    export const empty_registration: RegistrationInfo = {
        email: "",
        password: "",
        permission: 0,
        role: 0,
        username: "",
    };

    export const search_range: SearchQuery_ByRange = {
        earliest: "0.1.0",
        latest: "2.8.5",
    };

    export const search_regex: SearchQuery_ByRegex = {
        // Anthony's work goes here
    };

    export const search_carat: SearchQuery_ByCarat = {
        // Jorge's work here
    };

    export const search_tilde: SearchQuery_ByTilde = {
        // Jorge's work here
    };
}

// ========================= Profile Operations =========================
export namespace User {
    export const RegisterUser = new OpUnderRestriction<string | undefined>(
        Auth0_Database.INSERT,
        ALL_PERMISSIONS,
        [Role.Admin],
        ExInput.empty_registration
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
        ExInput.empty_changeReq
    );
}

// ========================= Package-Related Operations =========================
export namespace User {
    async function Upload_Unrestricted(
        submission: EditablePackageFields | EditablePackageFields[]
    ): Promise<boolean> {
        const client = new MongoClient(URI);
        const multiUpload = Array.isArray(submission);

        try {
            client.connect();
            const database = client.db(MAIN_DB);
            const collection = database.collection(PACKAGE_COLLECTION_NAME);

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
        const client = new MongoClient(URI);

        try {
            client.connect();
            const database = client.db(MAIN_DB);
            const collection = database.collection(PACKAGE_COLLECTION_NAME);
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
        const client = new MongoClient(URI);

        try {
            client.connect();
            const database = client.db(MAIN_DB);
            const collection = database.collection(PACKAGE_COLLECTION_NAME);

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
        const client = new MongoClient(URI);
        const multiDelete = Array.isArray(targets);
        const filter: Filter<Document> = {
            _id: targets,
        };

        try {
            client.connect();
            const database = client.db(MAIN_DB);
            const collection = database.collection(PACKAGE_COLLECTION_NAME);
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

    async function Download_Unrestricted(packageID: string[]): Promise<Package | undefined> {
        try {
            // Ben's content here
        } catch (error) {
            return undefined;
        }
    }

    function UpdatePackageVersions(requests: UpdatePackageRequest | UpdatePackageRequest[]) {
        return Array.isArray(requests) ? UpdateMany_Unrestricted(requests) : UpdateOne_Unrestricted(requests);
    }

    async function UnrestrictedSearchBy_Exact(criteria: string): Promise<RegistrySearchResult | undefined> {
        const client = new MongoClient(URI);
        try {
            client.connect();
            const database = client.db(MAIN_DB);
            const collection = database.collection(PACKAGE_COLLECTION_NAME);

            const cursor = collection.find({ version: criteria });
            const matches: FindCursor<PackageMetaData> = cursor.project({
                metadata: 1,
            });
            return await matches.toArray();
        } catch (error) {
            LogDebug("A write to the package database failed.");
            return undefined;
        } finally {
            client.close();
        }
    }

    async function UnrestrictedSearchBy_SimpleRange(
        criteria: SearchQuery_ByRange
    ): Promise<RegistrySearchResult | undefined> {
        const client = new MongoClient(URI);
        try {
            client.connect();
            const database = client.db(MAIN_DB);
            const collection = database.collection(PACKAGE_COLLECTION_NAME);

            const cursor = collection.find({ version: { $gte: criteria.earliest, $lte: criteria.latest } });
            const matches: FindCursor<PackageMetaData> = cursor.project({
                metadata: 1,
            });
            return await matches.toArray();
        } catch (error) {
            LogDebug("A write to the package database failed.");
            return undefined;
        } finally {
            client.close();
        }
    }

    async function UnrestrictedSearchBy_Regex(criteria: string): Promise<RegistrySearchResult | undefined> {
        return undefined;
    }

    async function UnrestrictedSearchBy_Tilde(
        criteria: SearchQuery_ByTilde
    ): Promise<RegistrySearchResult | undefined> {
        return undefined;
    }

    async function UnrestrictedSearchBy_Carat(
        criteria: SearchQuery_ByCarat
    ): Promise<RegistrySearchResult | undefined> {
        return undefined;
    }

    // ========================= Private Helpers Above + Exported Functions Below =========================

    export const UploadPackage = new OpUnderRestriction<boolean>(
        Upload_Unrestricted,
        ALLOW_U,
        [Role.External, Role.Internal, Role.Admin],
        ExInput.packageUpload
    );

    export const VersionPackage = new OpUnderRestriction<boolean>(
        UpdatePackageVersions,
        ALLOW_U,
        ALL_ROLES,
        ExInput.packageVersioning
    );

    export const RemoveFromRegistry = new OpUnderRestriction<boolean>(
        RemovePackages,
        [Permission._111],
        [Role.Admin],
        ExInput.packageRemoval
    );

    export const DownloadPackage = new OpUnderRestriction<Package | undefined>(
        Download_Unrestricted,
        ALLOW_D,
        ALL_ROLES,
        ExInput.packageDownload
    );

    export const SearchBy_Exact = new OpUnderRestriction<RegistrySearchResult | undefined>(
        UnrestrictedSearchBy_Exact,
        ALLOW_S,
        ALL_ROLES,
        "7.7.7"
    );

    export const SearchBy_Range = new OpUnderRestriction<RegistrySearchResult | undefined>(
        UnrestrictedSearchBy_SimpleRange,
        ALLOW_S,
        ALL_ROLES,
        ExInput.search_range
    );

    export const SearchBy_Regex = new OpUnderRestriction<RegistrySearchResult | undefined>(
        UnrestrictedSearchBy_Regex,
        ALLOW_S,
        ALL_ROLES,
        ExInput.search_regex
    );

    export const SearchBy_Carat = new OpUnderRestriction<RegistrySearchResult | undefined>(
        UnrestrictedSearchBy_Carat,
        ALLOW_S,
        ALL_ROLES,
        ExInput.search_carat
    );

    export const SearchBy_Tilde = new OpUnderRestriction<RegistrySearchResult | undefined>(
        UnrestrictedSearchBy_Tilde,
        ALLOW_S,
        ALL_ROLES,
        ExInput.search_tilde
    );
}

// ========================= System-Reset Related Operations =========================
export namespace User {
    async function DeleteAllUsers(): Promise<boolean> {
        // Retrieve all user IDs
        const userIDs = await Auth0_Database.SELECT_UID();
        if (!userIDs) {
            return false;
        }
        let failures = 0;

        // Delete each user individually
        for (const uid of userIDs) {
            if (uid === DEFAULT_UID) {
                continue;
            }
            try {
                await axios.delete(`https://${auth0Domain}/api/v2/users/${uid}`, {
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

    async function ClearAllPackages(): Promise<void> {
        const client = new MongoClient(URI);

        try {
            await client.connect();
            const database = client.db(MAIN_DB);
            const collection = database.collection(PACKAGE_COLLECTION_NAME);
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

    async function ResetSystem_Unrestricted(args: any[]): Promise<boolean> {
        if (!process.env.MONGODB_URL) {
            throw new Error("Missing env variable MONGO_URL");
        }

        try {
            const deletedAll = await DeleteAllUsers();
            await ClearAllPackages();
            return deletedAll;
        } catch (error) {
            return false;
        }
    }

    // ========================= Private Helpers Above + Exported Functions Below =========================

    export const ResetSystem = new OpUnderRestriction<boolean>(
        ResetSystem_Unrestricted,
        [Permission._111],
        [Role.Admin]
    );

    export const ClearRegistry = new OpUnderRestriction<void>(
        ClearAllPackages,
        [Permission._111],
        [Role.Admin]
    );

    export const EmptyUserDatabase = new OpUnderRestriction<boolean>(
        DeleteAllUsers,
        [Permission._111],
        [Role.Admin]
    );
}
