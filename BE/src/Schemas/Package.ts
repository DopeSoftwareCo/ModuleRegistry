import mongoose, { Schema } from "mongoose";
import { Base } from "./Base";

export interface Package extends Base {
    repoUrl: string;
    metadata: {
        Name: string;
        Version: string;
        License: {
            name: string;
        };
        IsExternal: boolean;
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

export const packageSchema: Schema<Package> = new Schema({
    //this is package id, we will let mongodb handle the uuids on creation of document entry in db
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        default: () => new mongoose.Types.ObjectId(),
    },
    repoUrl: {
        type: String,
        required: true,
    },
    metadata: {
        Name: {
            type: String,
            required: true,
        },
        Version: {
            type: String,
            required: true,
        },
        License: {
            name: {
                type: String,
                required: true,
            },
        },
        IsExternal: {
            type: Boolean,
            required: true,
        },
    },
    RampupTime: {
        rampup_score: {
            type: Number,
            required: true,
        },
        rampup_score_latency: {
            type: Number,
            required: true,
        },
    },
    Correctness: {
        score_correctness: {
            type: Number,
            required: true,
        },
        score_correctness_latency: {
            type: Number,
            required: true,
        },
    },
    BusFactor: {
        score_busFactor: {
            type: Number,
            required: true,
        },
        score_busFactor_latency: {
            type: Number,
            required: true,
        },
    },
    Responsiveness: {
        score_responsiveMaintainer: {
            type: Number,
            required: true,
        },
        score_responsiveMaintainer_latency: {
            type: Number,
            required: true,
        },
    },
    LicenseCompatibility: {
        score_license: {
            type: Number,
            required: true,
        },
        score_license_latency: {
            type: Number,
            required: true,
        },
    },
    VersionDependence: {
        score_versionDependence: {
            type: Number,
            required: true,
        },
        score_versionDependence_latency: {
            type: Number,
            required: true,
        },
    },
    MergeRestriction: {
        score_mergeRestriction: {
            type: Number,
            required: true,
        },
        score_mergeRestriction_latency: {
            type: Number,
            required: true,
        },
    },
    IndividualSizeCost: {
        score_sizeCostStandalone: {
            type: Number,
            required: true,
        },
        score_sizeCostStandalone_latency: {
            type: Number,
            required: true,
        },
    },
    GoodPinningPractice: {
        score_goodPinningPractice: {
            type: Number,
            required: true,
        },
        score_goodPinningPracticeLatency: {
            type: Number,
            required: true,
        },
    },
    PullRequest: {
        score_pullRequest: {
            type: Number,
            required: true,
        },
        score_pullRequestLatency: {
            type: Number,
            required: true,
        },
    },
    TotalSizeCost: {
        score_sizeCostTotal: {
            type: Number,
            required: true,
        },
        score_sizeCostTotal_latency: {
            type: Number,
            required: true,
        },
    },
    FinalRating: {
        netscore: {
            type: Number,
            required: true,
        },
        netscore_latency: {
            type: Number,
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

const PackageModel = mongoose.model<Package>(
    "Package",
    packageSchema,
    `Packages${process.env.NODE_ENV === "dev" ? "Dev" : ""}`
);

export default PackageModel;
