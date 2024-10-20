"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VersionDependence_Scorer = VersionDependence_Scorer;
exports.MergeRestriction_Scorer = MergeRestriction_Scorer;
var dotenv = require("dotenv"); //remove after testing
var TargetRepository_1 = require("../SingleClasses/TargetRepository");
var RepoIDTypes_1 = require("../Types/RepoIDTypes");
var QueryBuilder_1 = require("../Querying/Builders/QueryBuilder");
var QueryFields_1 = require("../Querying/Builders/QueryFields");
var QueryFields_2 = require("../Querying/Builders/QueryFields");
// Recall the enum ...
//VersionDependence = 5,
//PRMergeRestriction = 6,
// How crucial are each of these factors on a 1-7 scale?
/*
                   METRIC NAME      AN "IDEAL" SCORE IS
                ----------------------------------------
                 Ramp Up Time:      HIGH
                  Correctness:      HIGH
                   Bus Factor:      HIGH
    Maintainer Responsiveness:      HIGH
        License Compatibility:      == 1
           Version Dependency:       LOW        (Calculate this as the inverse of dependence, i.e. 1/dep)
         PR Merge Restriction:      HIGH

*/
function VersionDependence_Scorer(repo) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            result = -1;
            return [2 /*return*/, result];
        });
    });
}
function MergeRestriction_Scorer(repo) {
    return __awaiter(this, void 0, void 0, function () {
        var owner, repoName, prWithMultipleParents, pullRequests, error_1, queryString, totalCommits, result, error_2, Score, roundedScore;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    owner = repo.Identifiers.owner;
                    repoName = repo.Identifiers.repoName;
                    prWithMultipleParents = 0;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fetchAllPullRequests(owner, repoName)];
                case 2:
                    pullRequests = _a.sent();
                    prWithMultipleParents = pullRequests.filter(function (pr) { return pr.mergeCommit && pr.mergeCommit.parents.totalCount >= 2; }).length;
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error("Error fetching pull requests:", error_1);
                    return [2 /*return*/, 0];
                case 4:
                    queryString = (0, QueryFields_2.CreateTotalCommitsField)(owner, repoName);
                    totalCommits = 0;
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, (0, QueryBuilder_1.SendRequestToGQL)(queryString)];
                case 6:
                    result = _a.sent();
                    if (result && result.data) {
                        totalCommits = result.data.repository.object.history.totalCount;
                    }
                    else {
                        console.error("Result or result.data is undefined");
                        return [2 /*return*/, 0];
                    }
                    return [3 /*break*/, 8];
                case 7:
                    error_2 = _a.sent();
                    console.error("Error fetching data from GraphQL:", error_2);
                    return [2 /*return*/, 0];
                case 8:
                    console.log("Total Commits:", totalCommits);
                    console.log("Number of approved PRs:", prWithMultipleParents);
                    Score = (prWithMultipleParents / totalCommits) * 100;
                    roundedScore = parseFloat(Score.toFixed(2));
                    console.log("Score:", roundedScore + "%");
                    return [2 /*return*/, roundedScore];
            }
        });
    });
}
function fetchAllPullRequests(owner, repoName) {
    return __awaiter(this, void 0, void 0, function () {
        var allPullRequests, hasNextPage, after, queryString, result, pullRequests, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    allPullRequests = [];
                    hasNextPage = true;
                    after = null;
                    _a.label = 1;
                case 1:
                    if (!hasNextPage) return [3 /*break*/, 6];
                    queryString = (0, QueryFields_1.CreateReviewedPRField)(owner, repoName, after);
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, (0, QueryBuilder_1.SendRequestToGQL)(queryString)];
                case 3:
                    result = _a.sent();
                    if (result && result.data) {
                        pullRequests = result.data.repository.pullRequests.nodes;
                        allPullRequests = allPullRequests.concat(pullRequests);
                        hasNextPage = result.data.repository.pullRequests.pageInfo.hasNextPage;
                        after = result.data.repository.pullRequests.pageInfo.endCursor;
                    }
                    else {
                        console.error("Result or result.data is undefined");
                        return [3 /*break*/, 6];
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_3 = _a.sent();
                    console.error("Error fetching data from GraphQL:", error_3);
                    return [3 /*break*/, 6];
                case 5: return [3 /*break*/, 1];
                case 6: return [2 /*return*/, allPullRequests];
            }
        });
    });
}
dotenv.config();
var envVarNames = ["GITHUB_TOKEN"];
var url = "https://github.com";
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var repoID, repo, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, RepoIDTypes_1.Generate_RepositoryID)("https://github.com/cloudinary/cloudinary_npm")];
                case 1:
                    repoID = _a.sent();
                    if (!repoID) return [3 /*break*/, 3];
                    repo = new TargetRepository_1.TargetRepository(repoID);
                    return [4 /*yield*/, MergeRestriction_Scorer(repo)];
                case 2:
                    result = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    console.error("Failed to generate repository ID");
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
main();
