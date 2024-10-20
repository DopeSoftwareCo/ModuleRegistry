"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepoQueryResult = void 0;
;
var RepoQueryResult = /** @class */ (function () {
    function RepoQueryResult(params) {
        this.repoName = params.name;
        this.gitURL = params.repoURL;
        this.description = params.description;
        this.license = params.license;
        this.openIssues = params.openIssues;
        this.stargazerCount = params.stargazerCount;
        this.contributors = params.contributors;
        this.mergeData = params.mergeData;
        this.pullRequestData = params.pullRequestData;
        this.dependencyData = params.dependencyData;
        this.ref = params.ref;
        this.readmeFile = params.readmeFile;
        this.testsCheckMain = params.testsCheckMain;
        this.testsCheckMaster = params.testsCheckMaster;
    }
    Object.defineProperty(RepoQueryResult.prototype, "Ref", {
        get: function () {
            return this.ref;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RepoQueryResult.prototype, "RepoName", {
        get: function () { return this.repoName; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RepoQueryResult.prototype, "GitURL", {
        get: function () { return this.gitURL; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RepoQueryResult.prototype, "Description", {
        get: function () { return this.description; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RepoQueryResult.prototype, "License", {
        get: function () { return this.license; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RepoQueryResult.prototype, "OpenIssueCount", {
        get: function () { return this.openIssues; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RepoQueryResult.prototype, "StargazerCount", {
        get: function () { return this.stargazerCount; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RepoQueryResult.prototype, "Contributors", {
        get: function () { return this.contributors; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RepoQueryResult.prototype, "MergeData", {
        get: function () { return this.mergeData; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RepoQueryResult.prototype, "PullRequestData", {
        get: function () { return this.pullRequestData; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RepoQueryResult.prototype, "DependencyData", {
        get: function () { return this.dependencyData; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RepoQueryResult.prototype, "README", {
        get: function () { return this.readmeFile; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RepoQueryResult.prototype, "TestsCheck_Main", {
        get: function () { return this.testsCheckMain; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RepoQueryResult.prototype, "TestsCheck_Master", {
        get: function () { return this.testsCheckMaster; },
        enumerable: false,
        configurable: true
    });
    return RepoQueryResult;
}());
exports.RepoQueryResult = RepoQueryResult;
/*
    NDJSONRow: Partial<{
        URL: string;
        NetScore: number;
        NetScore_Latency: number;
        RampUp: number;
        RampUp_Latency: number;
        Correctness: number;
        Correctness_Latency: number;
        BusFactor: number;
        BusFactor_Latency: number;
        ResponsiveMaintainer: number;
        ResponsiveMaintainer_Latency: number;
        License: number;
        License_Latency: number;
    }>;*/ 
