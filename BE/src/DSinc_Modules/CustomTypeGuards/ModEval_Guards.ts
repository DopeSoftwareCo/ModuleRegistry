import { RepoURL } from "../../Providers/ModEval/RepoComponents/URL/URLProcessor.interface";
import { Repository } from "../../Providers/ModEval/RepoComponents/Repository";
import { RepoID } from "../../Providers/ModEval/RepoComponents/ID/RepoID";

export function IsType_RepoURL(value: any): value is RepoURL {
    console.log(" ===== TypeGuard URL ======");
    try {
        if (!value) {
            return false;
        }

        let typeMatch = false;
        let failures = 0;

        failures += typeof value.providedURL === "string" ? 0 : 1;
        failures += typeof value.domain === "string" ? 0 : 1;
        failures += typeof value.tokens.UndefinedOr_Content === "object" ? 0 : 1;

        if (!value.tokens.IsEmpty) {
            failures += typeof value.tokens.Content[0] === "string" ? 0 : 1;
        }

        failures += typeof value.gitURL === "string" ? 0 : 1;

        typeMatch = failures == 0;
        return typeMatch;
    } catch {
        console.log("EEE");
        return false;
    }
}

export function IsType_RepoID(value: any): value is RepoID {
    console.log(" ===== TypeGuard ID ======");
    try {
        if (!value) {
            return false;
        }

        let typeMatch = false;
        let failures = 0;

        failures += typeof value.Owner === "string" ? 0 : 1;
        if (failures > 0) console.log("Failed #1");
        failures += typeof value.Name === "string" ? 0 : 1;
        if (failures > 0) console.log("Failed #2");
        failures += typeof value.GitHubAddress === "string" ? 0 : 1;
        if (failures > 0) console.log("Failed #3");
        failures += IsType_RepoURL(value.URL) ? 0 : 1;
        if (failures > 0) console.log("Failed #4");

        typeMatch = failures == 0;
        return typeMatch;
    } catch {
        console.log("Typecheck error!!");
        return false;
    }
}

export function IsType_Repository(value: any): value is Repository {
    let typeMatch = false;

    try {
        if (value) {
            let failures = 0;

            failures += typeof value.providedURL === "string" ? 0 : 1;
            failures += typeof value.domain === "string" ? 0 : 1;
            failures += typeof value.tokens === "undefined" || typeof value[0] === "string" ? 0 : 1;
            failures += typeof value.gitURL === "string" ? 0 : 1;

            typeMatch = failures == 0;
        }
        return typeMatch;
    } catch {
        return false;
    }
}
