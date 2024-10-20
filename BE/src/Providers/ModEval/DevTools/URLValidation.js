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
exports.IsNpmLink = IsNpmLink;
exports.ValidateRepoURL = ValidateRepoURL;
exports.RetrieveGitHubURL = RetrieveGitHubURL;
exports.ObtainPackageName = ObtainPackageName;
exports.ReadFileUrls = ReadFileUrls;
var fs_1 = require("fs");
function IsNpmLink(url) {
    // Regex to check if the input is an npmjs URL
    var npmRegex = /^(https?:\/\/)?(www\.)?npmjs\.com\/package\/(.+)$/;
    return npmRegex.test(url);
}
function ValidateRepoURL(url) {
    var githubRepoRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/([^\/]+)\/([^\/]+?)(?:\.git)?$/;
    var match = url.match(githubRepoRegex);
    if (match) {
        var details = {
            repoURL: url,
            tokens: match
        };
        return details;
    }
    return undefined;
}
function RetrieveGitHubURL(url) {
    return __awaiter(this, void 0, void 0, function () {
        var packageName, response, packageData, repositoryUrl, _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!IsNpmLink(url)) return [3 /*break*/, 5];
                    packageName = ObtainPackageName(url);
                    console.log(packageName);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch("https://registry.npmjs.org/".concat(packageName))];
                case 2:
                    response = _c.sent();
                    if (!response.ok) {
                        throw new Error("HTTP error! Status: ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 3:
                    packageData = _c.sent();
                    repositoryUrl = (_b = packageData.repository) === null || _b === void 0 ? void 0 : _b.url;
                    return [2 /*return*/, ValidateRepoURL(repositoryUrl)];
                case 4:
                    _a = _c.sent();
                    return [2 /*return*/, undefined];
                case 5:
                    console.log("investigate the validatrepo function...");
                    // Ok ... url isn't an npm url, so either it's a github url or it's invalid
                    return [2 /*return*/, ValidateRepoURL(url)];
            }
        });
    });
}
function ObtainPackageName(npmURL) {
    var packageInfo = npmURL.match(/\/package\/(.+)/);
    var title = packageInfo ? packageInfo[1] : ' ';
    return title;
}
function ReadFileUrls(filepath) {
    var fileContents = (0, fs_1.readFileSync)(filepath, 'utf8');
    var urls = fileContents.split(/\r?\n/).filter(function (line) { return line.trim() !== ''; });
    return urls;
}
