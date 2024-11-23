import {
    CreateCommitsField,
    CreateDependenciesField,
    CreateIssuesField,
    CreateLanguagesField,
    CreateLicenseField,
    CreateMergesField,
    CreatePullRequestsField,
    CreateReactionsField,
    CreateReadmeField,
    CreateTestMainQuery,
    CreateTestMasterQuery,
    CreateVulnerabilityAlertsField,
} from "./Fields";

export const defaultFields = [
    "description",
    "name",
    "url",
    `owner {
        login
    }`,
    `openIssues: issues(states: OPEN) {
        totalCount
    }`,
    `closedIssues: issues(states: CLOSED) {
        totalCount
    }`,
    CreateLicenseField(),
];

export const extraFields = [
    "stargazerCount",
    "forkCount",
    "updatedAt",
    "pushedAt",
    "isPrivate",
    "isFork",
    `watchers {
        totalCount
    }`,
    `primaryLanguage {
        name
    }`,
    CreateLanguagesField(5),
    CreateVulnerabilityAlertsField(10),
    CreateIssuesField(0),
    CreateReadmeField(),
    CreateDependenciesField(10),
    CreateMergesField(10),
    CreatePullRequestsField(10),
    CreateTestMainQuery(),
    CreateTestMasterQuery(),
];
