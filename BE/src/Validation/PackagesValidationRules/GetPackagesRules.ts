import { body, CustomValidator } from "express-validator";

export const hasVersionObject = (): CustomValidator => {
    console.log("hello");
    return (value) => {
        console.log("validating", value);
        if (!Array.isArray(value)) {
            console.log("failing not array");
            throw new Error(
                "There is missing field(s) in the PackageQuery/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid."
            );
        }
        for (const item of value) {
            console.log("item to validate in value", item);
            // Check if each item is an object
            if (typeof item !== "object" || item === null) {
                console.log("failing due to item not being object");
                throw new Error(
                    "There is missing field(s) in the PackageQuery/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid."
                );
            }

            if (typeof item.Version !== "string" || item.Version === null) {
                throw new Error(
                    "There is missing field(s) in the PackageQuery/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid."
                );
            }

            if (typeof item.Name !== "string" || item.Name === null) {
                throw new Error(
                    "There is missing field(s) in the PackageQuery/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid."
                );
            }
        }

        return true;
    };
};

export const GetPackagesRules = [body().custom(hasVersionObject())];
