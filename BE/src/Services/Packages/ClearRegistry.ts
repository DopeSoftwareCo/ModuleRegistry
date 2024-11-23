import mongoose from "mongoose";

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
