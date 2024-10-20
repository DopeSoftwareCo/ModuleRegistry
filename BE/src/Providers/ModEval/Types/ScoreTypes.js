"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetValue = exports.RepositoryScoreSet = exports.SubscoreName = exports.EMPTY_SCOREINFO = void 0;
exports.EMPTY_SCOREINFO = { scoreVal: -1, time: -1 };
var SubscoreName;
(function (SubscoreName) {
    SubscoreName[SubscoreName["RampUpTime"] = 0] = "RampUpTime";
    SubscoreName[SubscoreName["Correctness"] = 1] = "Correctness";
    SubscoreName[SubscoreName["BusFactor"] = 2] = "BusFactor";
    SubscoreName[SubscoreName["MaintainerResponsiveness"] = 3] = "MaintainerResponsiveness";
    SubscoreName[SubscoreName["LienseCompatibility"] = 4] = "LienseCompatibility";
    SubscoreName[SubscoreName["VersionDependence"] = 5] = "VersionDependence";
    SubscoreName[SubscoreName["PRMergeRestriction"] = 6] = "PRMergeRestriction";
    SubscoreName[SubscoreName["Unknown"] = 7] = "Unknown";
})(SubscoreName || (exports.SubscoreName = SubscoreName = {}));
var RepositoryScoreSet = /** @class */ (function () {
    function RepositoryScoreSet() {
        this.weightSum = 0;
        this.scoreSum = 0;
        this.time = 0;
        this.net = 0;
        this.rampup_score = exports.EMPTY_SCOREINFO;
        this.correctness_score = exports.EMPTY_SCOREINFO;
        this.busfactor_score = exports.EMPTY_SCOREINFO;
        this.responsiveness_score = exports.EMPTY_SCOREINFO;
        this.license_score = exports.EMPTY_SCOREINFO;
        this.versionDependence_score = exports.EMPTY_SCOREINFO;
        this.mergeRestriction_score = exports.EMPTY_SCOREINFO;
    }
    RepositoryScoreSet.prototype.Copy = function (rhs) {
        this.weightSum = rhs.weightSum;
        this.scoreSum = rhs.scoreSum;
        this.time = rhs.time;
    };
    RepositoryScoreSet.prototype.Add = function (subscore, weight) {
        if (weight === void 0) { weight = 1; }
        this.scoreSum += subscore.scoreVal;
        this.time += subscore.time;
        this.weightSum += weight;
    };
    RepositoryScoreSet.prototype.TimeSum = function () {
        return this.time;
    };
    RepositoryScoreSet.prototype.ScoreSum = function () {
        return this.scoreSum;
    };
    RepositoryScoreSet.prototype.CurrentScore = function () {
        return this.weightSum == 0 ? -1 : this.scoreSum / this.weightSum;
    };
    return RepositoryScoreSet;
}());
exports.RepositoryScoreSet = RepositoryScoreSet;
var NetValue = /** @class */ (function () {
    function NetValue() {
        this.weightSum = 0;
        this.scoreSum = 0;
        this.time = 0;
    }
    NetValue.prototype.Copy = function (rhs) {
        this.weightSum = rhs.weightSum;
        this.scoreSum = rhs.scoreSum;
        this.time = rhs.time;
    };
    NetValue.prototype.Add = function (subscore, weight) {
        if (weight === void 0) { weight = 1; }
        this.scoreSum += subscore.scoreVal;
        this.time += subscore.time;
        this.weightSum += weight;
    };
    NetValue.prototype.TimeSum = function () {
        return this.time;
    };
    NetValue.prototype.ScoreSum = function () {
        return this.scoreSum;
    };
    NetValue.prototype.CurrentScore = function () {
        return this.weightSum == 0 ? -1 : this.scoreSum / this.weightSum;
    };
    return NetValue;
}());
exports.NetValue = NetValue;
