/**
 * @author John Leidy
 * @description This module is responsible for verifying that the get packages request is proper
 * Checking all items in the array to ensure they are of the proper format.
 * Again at the controller ensuring that all data is proper and exists before allowing any computation on it.
 */
import { body, CustomValidator, header } from "express-validator";

const InvalidGetPackagesMessage =
    "There is missing field(s) in the PackageQuery or it is formed improperly, or is invalid.";

export const hasVersionObject = (): CustomValidator => {
    return (value) => {
        if (!Array.isArray(value)) {
            throw new Error(InvalidGetPackagesMessage);
        }
        for (const item of value) {
            // Check if each item is an object
            if (typeof item !== "object" || item === null) {
                throw new Error(InvalidGetPackagesMessage);
            }

            if (typeof item.Version !== "string" || item.Version === null) {
                throw new Error(InvalidGetPackagesMessage);
            }

            if (typeof item.Name !== "string" || item.Name === null) {
                throw new Error(InvalidGetPackagesMessage);
            }
        }

        return true;
    };
};

export const GetPackagesRules = [body().custom(hasVersionObject())];
