import mongoose, { Schema } from "mongoose";
import { Base } from "./Base";

export type Rating = { score: number; latency: number };
const Rating_Empty = { score: 0, latency: 0 };

export type MongoRatings = {
    BusFactor: Rating;
    Correctness: Rating;
    RampUp: Rating;
    ResponsiveMaintainer: Rating;
    LicenseScore: Rating;
    GoodPinningPractice: Rating;
    PullRequest: Rating;
    IndividualSizeCost: Rating;
    TotalSizeCost: Rating;
    Net: Rating;
};
export const MongoRatings_Empty = {
    BusFactor: Rating_Empty,
    Correctness: Rating_Empty,
    RampUp: Rating_Empty,
    ResponsiveMaintainer: Rating_Empty,
    LicenseScore: Rating_Empty,
    GoodPinningPractice: Rating_Empty,
    PullRequest: Rating_Empty,
    IndividualSizeCost: Rating_Empty,
    TotalSizeCost: Rating_Empty,
    Net: Rating_Empty,
};

export interface Package extends Base {
    Name: string;
    URL: string;
    Version: string;
    License: string;
    Uploader: string;
    IsExternal: boolean;
    Safety: "unsafe" | "unkown" | "vetted";
    Visibility: "secret" | "internal" | "public";
    Ratings: MongoRatings;
    dataRefs: {
        ContentID: string; // UUID of the package content in storage
        JSRef: string; // Some 'reference' to the location of the associated JS program
    };
}

export const packageSchema: Schema<Package> = new Schema({
    //this is package id, we will let mongodb handle the uuids on creation of document entry in db
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        default: () => new mongoose.Types.ObjectId(),
    },
    Name: {
        type: String,
        required: true,
    },
    URL: {
        type: String,
        required: true,
    },
    Version: {
        type: String,
        required: true,
    },
    License: {
        type: String,
        required: true,
    },
    Uploader: {
        type: String,
        required: true,
    },
    IsExternal: {
        type: Boolean,
        required: true,
    },
    Safety: {
        type: String,
        enum: ["unsafe", "unknown", "vetted"],
        required: true,
    },
    Visibility: {
        type: String,
        enum: ["secret", "internal", "public"],
        required: true,
    },
    Ratings: {
        BusFactor: { score: { type: Number, required: true }, latency: { type: Number, required: true } },
        Correctness: { score: { type: Number, required: true }, latency: { type: Number, required: true } },
        RampUp: { score: { type: Number, required: true }, latency: { type: Number, required: true } },
        ResponsiveMaintainer: {
            score: { type: Number, required: true },
            latency: { type: Number, required: true },
        },
        LicenseScore: { score: { type: Number, required: true }, latency: { type: Number, required: true } },
        GoodPinningPractice: {
            score: { type: Number, required: true },
            latency: { type: Number, required: true },
        },
        PullRequest: { score: { type: Number, required: true }, latency: { type: Number, required: true } },
        IndividualSizeCost: {
            score: { type: Number, required: true },
            latency: { type: Number, required: true },
        },
        TotalSizeCost: { score: { type: Number, required: true }, latency: { type: Number, required: true } },
        Net: { score: { type: Number, required: true }, latency: { type: Number, required: true } },
    },
    dataRefs: {
        ContentID: {
            type: String,
            required: true,
        },
        JSRef: {
            type: String,
            required: true,
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
        required: true,
    },
});

// Update `updatedAt` field before saving the document
packageSchema.pre("save", function (next) {
    this.updatedAt = new Date();
    next();
});

const AltPackageModel = mongoose.model<Package>(
    "Package",
    packageSchema,
    `Packages${process.env.NODE_ENV === "dev" ? "Dev" : ""}`
);

export default AltPackageModel;
