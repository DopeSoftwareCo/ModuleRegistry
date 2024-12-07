import { Model } from "mongoose";
import { PackageMetaData } from "../../../Types/Models";
import PackageModel, { Package } from "../../../Schemas/Package";
import { SortByVersion, SortByVersion_Metadata } from "../Versioning/utils";
import { PartitionArray } from "../../../Utils/DSinc/Array";
import { ChunkOfPackages, FetchAllResult, PartitionedFetchAllResult } from "../Versioning/types";

async function GetChunk(chunkSize: number, skip: number): Promise<ChunkOfPackages> {
    // Fetch the next chunk
    const rawChunk = await PackageModel.find<Package>(
        {},
        { _id: 1, "metadata.Name": 1, "metadata.Version": 1 }
    )
        .skip(skip)
        .limit(chunkSize)
        .exec();

    const chunk = rawChunk.map((mongoPackage) => ({
        Version: mongoPackage.metadata.Version,
        Name: mongoPackage.metadata.Name,
        ID: mongoPackage._id.toString(),
    }));
    return chunk;
}

export async function FetchAllPackages_Unsorted(
    maxTimeMs: number = 5000, // Time limit in milliseconds
    chunkSize: number = 50 // Number of packages per chunk
): Promise<FetchAllResult> {
    const startTime = Date.now();
    let skip = 0;
    let allPackages: ChunkOfPackages = [];

    while (true) {
        // Check if the time limit has been reached
        if (Date.now() - startTime >= maxTimeMs) {
            return {
                data: allPackages,
                totalFetched: allPackages.length,
                isComplete: false,
            };
        }

        // Fetch the next chunk & add to a 1D array
        const chunk = await GetChunk(chunkSize, skip);
        allPackages = allPackages.concat(chunk);

        // Break if no more packages are left
        if (chunk.length < chunkSize) {
            break;
        }

        // Increment skip for the next chunk
        skip += chunkSize;

        // Introduce a ms delay between each fetch
        await new Promise((resolve) => setTimeout(resolve, 200));
    }

    return {
        data: allPackages,
        totalFetched: allPackages.length,
        isComplete: true,
    };
}

export async function FetchAllPackages(
    maxTimeMs: number = 5000,
    chunkSize: number = 50
): Promise<PartitionedFetchAllResult> {
    const fetchResult = await FetchAllPackages_Unsorted(maxTimeMs, chunkSize);
    const all = fetchResult.data;
    SortByVersion_Metadata(all, true);

    const sorted = PartitionArray<PackageMetaData>(all, chunkSize);
    return {
        chunks: sorted,
        totalFetched: fetchResult.totalFetched,
        isComplete: fetchResult.isComplete,
    };
}
