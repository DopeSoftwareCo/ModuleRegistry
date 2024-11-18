import mongoose, { Schema } from "mongoose";
import { Base } from "./Base";

export type PackageVersions = PackageVersion[];
export type PackageVersion = {
    Version: string;
    ContentID: string;
    URL: string;
    JSProjram: string;
    Debloat: boolean;
    Rating: MongoRatings;
};

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

export interface MongoPackage extends Base {
    Title: string;
    repoUrl: string;
    metadata: {
        Name: string;
        Version: string;
        License: {
            name: string;
            spxId: string;
            url: string;
        };
        Uploader: string;
        IsExternal: boolean;
        Safety: "unsafe" | "unkown" | "vetted";
        IsSecret: boolean; // No longer needed
        Visibility: "secret" | "internal" | "public"; // No longer need 3 options
        Availability: number;
        PrivelegedGroup: number; // No longer needed
    };
    data: {
        Content: string;
        JSProgram: string;
    };
    RampupTime: {
        rampup_score: number;
        rampup_score_latency: number;
    };
    Correctness: {
        score_correctness: number;
        score_correctness_latency: number;
    };
    BusFactor: {
        score_busFactor: number;
        score_busFactor_latency: number;
    };
    Responsiveness: {
        score_responsiveMaintainer: number;
        score_responsiveMaintainer_latency: number;
    };
    LicenseCompatibility: {
        score_license: number;
        score_license_latency: number;
    };
    VersionDependence: {
        score_versionDependence: number;
        score_versionDependence_latency: number;
    };
    MergeRestriction: {
        score_mergeRestriction: number;
        score_mergeRestriction_latency: number;
    };
    IndividualSizeCost: {
        score_sizeCostStandalone: number;
        score_sizeCostStandalone_latency: number;
    };
    TotalSizeCost: {
        score_sizeCostTotal: number;
        score_sizeCostTotal_latency: number;
    };
    GoodPinningPractice: {
        score_goodPinningPractice: number;
        score_goodPinningPracticeLatency: number;
    };
    PullRequest: {
        score_pullRequest: number;
        score_pullRequestLatency: number;
    };
    FinalRating: {
        netscore: number;
        netscore_latency: number;
    };
}

export interface Package extends Base {
    Name: string;
    URL: string;
    //Version: string;
    Versions: PackageVersions;
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
    Versions: {
        List: Array<{
            VString: {
                type: String;
                reqired: true;
            };
            ContentID: {
                type: String;
                reqired: true;
            };
            URL: {
                type: String;
                reqired: true;
            };
            JSProjram: {
                type: String;
                reqired: true;
            };
            Debloat: {
                type: Boolean;
                reqired: true;
            };
            Ratings: {
                BusFactor: {
                    score: { type: Number; required: true };
                    latency: { type: Number; required: true };
                };
                Correctness: {
                    score: { type: Number; required: true };
                    latency: { type: Number; required: true };
                };
                RampUp: {
                    score: { type: Number; required: true };
                    latency: { type: Number; required: true };
                };
                ResponsiveMaintainer: {
                    score: { type: Number; required: true };
                    latency: { type: Number; required: true };
                };
                LicenseScore: {
                    score: { type: Number; required: true };
                    latency: { type: Number; required: true };
                };
                GoodPinningPractice: {
                    score: { type: Number; required: true };
                    latency: { type: Number; required: true };
                };
                PullRequest: {
                    score: { type: Number; required: true };
                    latency: { type: Number; required: true };
                };
                IndividualSizeCost: {
                    score: { type: Number; required: true };
                    latency: { type: Number; required: true };
                };
                TotalSizeCost: {
                    score: { type: Number; required: true };
                    latency: { type: Number; required: true };
                };
                Net: { score: { type: Number; required: true }; latency: { type: Number; required: true } };
            };
        }>,
        required: true,
    },
    /*
    Version:
    {
        type: string,
        required: true,
    }
    */
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
