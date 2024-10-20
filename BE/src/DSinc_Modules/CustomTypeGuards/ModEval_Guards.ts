import { RepoURL } from "../../Providers/ModEval/RepoComponents/URL/URLProcessor.interface";
import { Repository } from "../../Providers/ModEval/RepoComponents/Repository";
import { RepoID } from "../../Providers/ModEval/RepoComponents/ID/RepoID";
import { I_RepoScoreset, RepoScoreset } from "../../Providers/ModEval/Scores/RepoScoreset";

export type GuardLogic = (value: any) => number;

export function IsType_RepoURL(value: any): value is RepoURL {
    const runChecks = (value: any) => {
        let failures = 0;

        failures += typeof value.providedURL === "string" ? 0 : 1;
        failures += typeof value.domain === "string" ? 0 : 1;
        failures += typeof value.tokens.UndefinedOr_Content === "object" ? 0 : 1;

        if (!value.tokens.IsEmpty) {
            failures += typeof value.tokens.Content[0] === "string" ? 0 : 1;
        }

        failures += typeof value.gitURL === "string" ? 0 : 1;
        return failures;
    };

    return SkeletonIsType<RepoID>(value, runChecks);
}

export function IsType_RepoID(value: any): value is RepoID {
    const runChecks = (value: any) => {
        let failures = 0;

        failures += typeof value.Owner === "string" ? 0 : 1;
        failures += typeof value.Name === "string" ? 0 : 1;
        failures += typeof value.GitHubAddress === "string" ? 0 : 1;
        failures += IsType_RepoURL(value.URL) ? 0 : 1;
        return failures;
    };

    return SkeletonIsType<RepoID>(value, runChecks);
}

export function IsType_Repository(value: any): value is Repository {
    const runChecks = (value: any) => {
        let failures = 0;

        failures += typeof value.License() === "string" ? 0 : 1;
        failures += IsType_RepoID(value.ID()) ? 0 : 1;
        failures += IsType_ScoresetFromRepo(value.Scores()) ? 0 : 1;
        //failures += IsType_NDJSONRow(value.NDJSONRow()) ? 0 : 1;
        return failures;
    };

    return SkeletonIsType<Repository>(value, runChecks);
}

export function IsType_ScoresetFromRepo(value: any): value is RepoScoreset {
    return value.extends(I_RepoScoreset);
}

export function SkeletonIsType<T>(value: any, ApplyGuardingLogic: GuardLogic): value is T {
    try {
        if (!value) {
            return false;
        }

        return ApplyGuardingLogic(value) == 0;
    } catch {
        return false;
    }
}
