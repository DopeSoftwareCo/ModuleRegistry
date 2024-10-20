"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTestMasterQuery = exports.CreateTestMainQuery = exports.CreateMergesField = exports.CreateContributorsField = exports.CreatePullRequestsField = exports.CreateDependenciesField = exports.CreateReadmeField = exports.CreateCommitsField = exports.CreateIssuesField = exports.CreateReactionsField = exports.CreateLicenseField = exports.CreateVulnerabilityAlertsField = exports.CreateLanguagesField = void 0;
exports.CreateReviewedPRField = CreateReviewedPRField;
exports.CreateTotalCommitsField = CreateTotalCommitsField;
/**
 * This module creates various fields, some are used some are unused.
 * @author DSinc
 */
var CreateLanguagesField = function (first) { return "\n    languages(first: ".concat(first, ") {\n        nodes {\n            name\n        }\n    }\n"); };
exports.CreateLanguagesField = CreateLanguagesField;
var CreateVulnerabilityAlertsField = function (first) { return "\n    vulnerabilityAlerts(first: ".concat(first, ") {\n        nodes {\n            securityAdvisory {\n                severity\n            }\n        }\n    }\n"); };
exports.CreateVulnerabilityAlertsField = CreateVulnerabilityAlertsField;
var CreateLicenseField = function () { return "\n    licenseInfo {\n        name\n        spdxId\n        url\n    }\n"; };
exports.CreateLicenseField = CreateLicenseField;
var CreateReactionsField = function (first) { return "\n    reactions: issues(first: ".concat(first, ") {\n        nodes {\n            reactions(first: 5) {\n                nodes {\n                    content\n                    user {\n                        login\n                    }\n                }\n            }\n        }\n    }\n"); };
exports.CreateReactionsField = CreateReactionsField;
var CreateIssuesField = function (first) { return "\n    openIssues: issues(states:OPEN) {\n        totalCount\n    }\n    closedIssues: issues(states:CLOSED) {\n        totalCount\n    }\n"; };
exports.CreateIssuesField = CreateIssuesField;
var CreateCommitsField = function (first) { return "\nref(qualifiedName: \"main\") {\n    target {\n        ... on Commit {\n            history(first: ".concat(first, ") {\n                edges {\n                    node {\n                        oid\n                        message\n                        committedDate\n                        author {\n                            name\n                            email\n                        }\n                    }\n                }\n            }\n        }\n    }\n}"); };
exports.CreateCommitsField = CreateCommitsField;
var CreateReadmeField = function () { return "\nreadmeFile: object(expression: \"HEAD:README.md\") {\n            ... on Blob {\n                text\n            }\n        }\n"; };
exports.CreateReadmeField = CreateReadmeField;
var CreateDependenciesField = function (first) { return "\n    dependencyGraphManifests(first: ".concat(first, ") {\n        nodes {\n            filename\n            dependencies(first: ").concat(first, ") {\n                nodes {\n                    packageName\n                    requirements\n                    hasDependencies\n                    packageManager\n                }\n            }\n        }\n    }\n"); };
exports.CreateDependenciesField = CreateDependenciesField;
var CreatePullRequestsField = function (first) { return "\n    pullRequests(first: ".concat(first, ", orderBy: { field: CREATED_AT, direction: DESC }) {\n        edges {\n            node {\n                id\n                title\n                number\n                body\n                createdAt\n                updatedAt\n                state\n                mergedAt\n                author {\n                    login\n                }\n                reviews(first: 5) {\n                    nodes {\n                        author {\n                            login\n                        }\n                        state\n                        submittedAt\n                    }\n                }\n                commits(last: 1) {\n                    nodes {\n                        commit {\n                            oid\n                            message\n                            committedDate\n                            author {\n                                name\n                                email\n                            }\n                        }\n                    }\n                }\n            }\n        }\n    }\n"); };
exports.CreatePullRequestsField = CreatePullRequestsField;
var CreateContributorsField = function (first) { return "\n    collaborators(first: ".concat(first, ") {\n        edges {\n            node {\n                login\n                name\n                contributionsCollection {\n                    contributionCalendar {\n                        totalContributions\n                    }\n                }\n                email\n                avatarUrl\n            }\n        }\n    }\n"); };
exports.CreateContributorsField = CreateContributorsField;
var CreateMergesField = function (first) { return "\n    ref(qualifiedName: \"main\") {\n        target {\n            ... on Commit {\n                history(first: ".concat(first, ") {\n                    edges {\n                        node {\n                            oid\n                            message\n                            committedDate\n                            author {\n                                name\n                                email\n                            }\n                            parents(first: 2) {\n                                totalCount\n                            }\n                        }\n                    }\n                }\n            }\n        }\n    }\n"); };
exports.CreateMergesField = CreateMergesField;
var CreateTestMainQuery = function () { return "\n  testsCheckMain: object(expression: \"main:\") {  \n      ... on Tree {\n        entries {\n          name\n          type\n        }\n      }\n    }\n"; };
exports.CreateTestMainQuery = CreateTestMainQuery;
var CreateTestMasterQuery = function () { return "\n  testsCheckMaster: object(expression: \"master:\") {  \n      ... on Tree {\n        entries {\n          name\n          type\n        }\n      }\n    }\n"; };
exports.CreateTestMasterQuery = CreateTestMasterQuery;
function CreateReviewedPRField(owner, repoName, after) {
    if (after === void 0) { after = null; }
    var afterClause = after ? ", after: \"".concat(after, "\"") : "";
    return "\n    {\n        repository(owner: \"".concat(owner, "\", name: \"").concat(repoName, "\") {\n            pullRequests(first: 100, states: MERGED").concat(afterClause, ") {\n                pageInfo {\n                    endCursor\n                    hasNextPage\n                }\n                nodes {\n                    number\n                    title\n                    mergeCommit {\n                        parents(first: 2) {\n                            totalCount\n                        }\n                    }\n                }\n            }\n        }\n    }\n    ");
}
function CreateTotalCommitsField(owner, repoName) {
    return "\n    {\n        repository(owner: \"".concat(owner, "\", name: \"").concat(repoName, "\") {\n            object(expression: \"HEAD\") {\n                ... on Commit {\n                    history {\n                        totalCount\n                    }\n                }\n            }\n        }\n    }\n    ");
}
