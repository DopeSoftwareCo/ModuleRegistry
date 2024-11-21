import dotenv from "dotenv";
dotenv.config();

export const Util = {
    Constants: {
        GITHUB_TOKEN: process.env.GITHUB_TOKEN,
        GITHUB_API_BASE_URL: "https://api.github.com",
    },
};
