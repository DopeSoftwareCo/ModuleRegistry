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
exports.TargetRepository = void 0;
exports.Adapt_GQLResponse_To_RepoQueryResult = Adapt_GQLResponse_To_RepoQueryResult;
var ScoreTypes_1 = require("../Types/ScoreTypes");
var QueryBuilder_1 = require("../Querying/Builders/QueryBuilder");
var EXTRA_QUERY_FIELDS = [
    "contributors",
    "merges",
    "dependencies",
    "totalCommits",
    "totalPullRequestsWithReview",
];
var TargetRepository = /** @class */ (function () {
    function TargetRepository(id, scoreset) {
        this.queried = false;
        this.license = "unknown";
        this.identifiers = id;
        if (scoreset) {
            this.scores = scoreset;
        }
        else {
            this.scores = {
                rampup_score: ScoreTypes_1.EMPTY_SCOREINFO,
                correctness_score: ScoreTypes_1.EMPTY_SCOREINFO,
                busfactor_score: ScoreTypes_1.EMPTY_SCOREINFO,
                responsiveness_score: ScoreTypes_1.EMPTY_SCOREINFO,
                license_score: ScoreTypes_1.EMPTY_SCOREINFO,
                versionDependence_score: ScoreTypes_1.EMPTY_SCOREINFO,
                mergeRestriction_score: ScoreTypes_1.EMPTY_SCOREINFO,
                net: new ScoreTypes_1.NetValue(),
            };
        }
        this.queryResult = undefined;
    }
    TargetRepository.prototype.SendQueryToGraphQL = function () {
        return __awaiter(this, void 0, void 0, function () {
            var queryString, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.queried) {
                            return [2 /*return*/, this.queryResult];
                        }
                        queryString = (0, QueryBuilder_1.RepoQueryBuilder)([this.Identifiers], EXTRA_QUERY_FIELDS);
                        return [4 /*yield*/, (0, QueryBuilder_1.SendRequestToGQL)(queryString)];
                    case 1:
                        response = _a.sent();
                        if (!response) {
                            return [2 /*return*/, this.queryResult];
                        }
                        this.queryResult = Adapt_GQLResponse_To_RepoQueryResult(response);
                        this.queried = true;
                        return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(TargetRepository.prototype, "License", {
        get: function () {
            return this.license;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TargetRepository.prototype, "Identifiers", {
        get: function () {
            return this.identifiers;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TargetRepository.prototype, "QueryResult", {
        get: function () {
            return this.queryResult;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TargetRepository.prototype, "Scores", {
        get: function () {
            return this.scores;
        },
        set: function (scoreset) {
            this.scores = scoreset;
        },
        enumerable: false,
        configurable: true
    });
    TargetRepository.prototype.NDJSONRow = function () {
        var row = {
            scores: this.scores,
            url: this.identifiers.url_info.gitURL,
        };
        return row;
    };
    return TargetRepository;
}());
exports.TargetRepository = TargetRepository;
function Adapt_GQLResponse_To_RepoQueryResult(gql_response) {
    var data = gql_response.data;
    /*const repoQueryResult = new RepoQueryResult(
    {
        name: data.RepoName,
        repoURL: data.GitURL,
        description: data.Description,
        license: data.License,
        openIssues: data.OpenIssueCount,
        stargazerCount: data.StargazerCount,
        contributors: data.Contributors,
        mergeData: data.MergeData,
        pullRequestData: data.PullRequestData,
        dependencyData: data.DependencyData,

        ref: data.Ref,
        readmeFile: data.README,
        testsCheckMain: data.TestsCheck_Main,
        testsCheckMaster: data.TestsCheck_Master,
    });
    return repoQueryResult;*/
    return data;
}
