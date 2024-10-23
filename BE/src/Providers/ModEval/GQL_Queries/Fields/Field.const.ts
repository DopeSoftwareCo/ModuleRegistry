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
    "name",
    `owner {
        login
    }`,
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
    CreateLicenseField(),
    CreateLanguagesField(5),
    CreateVulnerabilityAlertsField(10),
    CreateReactionsField(10),
    CreateIssuesField(0),
    CreateCommitsField(10),
    CreateReadmeField(),
    CreateDependenciesField(10),
    CreateMergesField(10),
    CreatePullRequestsField(10),
    CreateTestMainQuery(),
    CreateTestMasterQuery(),
];
