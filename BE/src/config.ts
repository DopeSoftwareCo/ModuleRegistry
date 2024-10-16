import dotenv from "dotenv";

dotenv.config();

export const APP_CONFIG = {
    outputWidth: 90,
    LOG_LEVEL: process.env.LOG_LEVEL
};
