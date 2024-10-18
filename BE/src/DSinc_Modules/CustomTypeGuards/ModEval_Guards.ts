import { RepoURL } from "../../Providers/ModEval/RepoComponents/URL/URLProcessor.interface";
import { Repository } from "../../Providers/ModEval/RepoComponents/Repository";
import { RepoID } from "../../Providers/ModEval/RepoComponents/ID/RepoID";

export function IsType_RepoURL(value: any): value is RepoURL {
    let typeMatch = false;

    try {
        if (value) {
            let failures = 0;

            failures += typeof value.providedURL === "string" ? 0 : 1;
            failures += typeof value.domain === "string" ? 0 : 1;
            failures += typeof value.tokens === "undefined" || typeof value[0] === "string" ? 0 : 1;
            failures += typeof value.gitURL === "string" ? 0 : 1;

            typeMatch = !(failures == 0);
        }
        return typeMatch;
    } catch {
        return false;
    }
}

export function IsType_RepoID(value: any): value is RepoID {
    let typeMatch = false;

    try {
        if (value) {
            let failures = 0;

            failures += typeof value.Owner === "string" ? 0 : 1;
            failures += typeof value.Name === "string" ? 0 : 1;
            failures += IsType_RepoURL(value.URL) ? 0 : 1;

            typeMatch = !(failures == 0);
        }
        return typeMatch;
    } catch {
        return false;
    }
}

export function IsType_TargetRepository(value: any): value is Repository {
    let typeMatch = false;

    try {
        if (value) {
            let failures = 0;

            failures += typeof value.providedURL === "string" ? 0 : 1;
            failures += typeof value.domain === "string" ? 0 : 1;
            failures += typeof value.tokens === "undefined" || typeof value[0] === "string" ? 0 : 1;
            failures += typeof value.gitURL === "string" ? 0 : 1;

            typeMatch = !(failures == 0);
        }
        return typeMatch;
    } catch {
        return false;
    }
}
