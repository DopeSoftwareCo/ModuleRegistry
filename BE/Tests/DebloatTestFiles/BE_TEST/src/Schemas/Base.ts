import mongoose, { Document } from "mongoose";

export interface Base extends Document {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
