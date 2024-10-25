import mongoose, { Schema } from "mongoose";
import { Base } from "./Base";

export interface Package extends Base {
    metaData: {
        Name: string;
        Version: string;
    };
    data: {
        Content: string;
        JSProgram: string;
    };
    title: string;
    repoUrl: string;
    uploader: string;
    visibility: "secret" | "internal" | "public";
    isExternal: boolean;
    safety: "unsafe" | "unkown" | "vetted";
    secrecyEnabled: boolean;
    license: string;
    rampup_score: number;
    score_correctness: number;
    score_busFactor: number;
    score_license: number;
    score_versionDependence: number;
    score_mergeRestriction: number;
    score_pullrequest: number;
    score_responsiveMaintainer: number;
    score_goodPinningPractice: number;
    score_sizeCostTotal: number;
    score_sizeCostStandalone: number;
    netscore: number;
}

export const packageSchema: Schema<Package> = new Schema({
    //this is package id, we will let mongodb handle the uuids on creation of document entry in db
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        default: () => new mongoose.Types.ObjectId(),
    },
    metaData: {
        Name: {
            type: String,
            required: true,
        },
        Version: {
            type: String,
            required: true,
        },
    },
    data: {
        Content: {
            type: String,
            required: true,
        },
        JSProgram: {
            type: String,
            required: true,
        },
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
    title: {
        type: String,
        required: true,
    },
    repoUrl: {
        type: String,
        required: true,
    },
    uploader: {
        type: String,
        required: true,
    },
    visibility: {
        type: String,
        enum: ["secret", "internal", "public"],
        required: true,
    },
    isExternal: {
        type: Boolean,
        required: true,
    },
    safety: {
        type: String,
        enum: ["unsafe", "unkown", "vetted"],
        required: true,
    },
    secrecyEnabled: {
        type: Boolean,
        required: true,
    },
    license: {
        type: String,
        required: true,
    },
    rampup_score: {
        type: Number,
        required: true,
    },
    score_correctness: {
        type: Number,
        required: true,
    },
    score_busFactor: {
        type: Number,
        required: true,
    },
    score_license: {
        type: Number,
        required: true,
    },
    score_versionDependence: {
        type: Number,
        required: true,
    },
    score_mergeRestriction: {
        type: Number,
        required: true,
    },
    score_pullrequest: {
        type: Number,
        required: true,
    },
    score_responsiveMaintainer: {
        type: Number,
        required: true,
    },
    score_goodPinningPractice: {
        type: Number,
        required: true,
    },
    score_sizeCostStandalone: {
        type: Number,
        required: true,
    },
    score_sizeCostTotal: {
        type: Number,
        required: true,
    },
    netscore: {
        type: Number,
        required: true,
    },
});

// Update `updatedAt` field before saving the document
packageSchema.pre("save", function (next) {
    this.updatedAt = new Date();
    next();
});

const PackageModel = mongoose.model<Package>(
    "Package",
    packageSchema,
    `Packages${process.env.NODE_ENV === "dev" ? "Dev" : ""}`
);

export default PackageModel;
