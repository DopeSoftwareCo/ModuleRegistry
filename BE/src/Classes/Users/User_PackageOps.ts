import { version } from "os";
import { LogDebug } from "../../Providers/Utils/Log";
import { OpUnderRestriction } from "../Ops-Under-Restriction/OpUnderRestriction";
import { Role, ALLOW_U, ALLOW_D, ALL_PERMISSIONS } from "./subdir.const";
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

// ========================= Package-Related Operations =========================
export namespace User {
    // ========================= Unexported, Unrestricted] Package-Related Operations =========================
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

    async function Downlod_Unrestricted(packageID: string[]): Promise<EditablePackageFields | undefined> {
        try {
            // Ben's content here
        } catch (error) {
            return undefined;
        }
    }
}
