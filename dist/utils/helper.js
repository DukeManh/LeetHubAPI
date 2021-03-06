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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Helper = void 0;
const request_promise_native_1 = __importDefault(require("request-promise-native"));
const interfaces_1 = require("./interfaces");
const graphql_request_1 = require("graphql-request");
const config_1 = __importDefault(require("../lib/config"));
const submission_1 = __importDefault(require("../lib/submission"));
const problem_1 = __importDefault(require("../lib/problem"));
const leetcode_1 = __importDefault(require("../lib/leetcode"));
class Helper {
    static setCredit(credit) {
        Helper.credit = credit;
    }
    static setUris(uris) {
        Helper.uris = uris;
    }
    // http request with options
    static HttpRequest(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield request_promise_native_1.default({
                method: options.method || 'GET',
                uri: options.url,
                followRedirect: options.followRedirect,
                followAllRedirects: options.followAllRedirects,
                resolveWithFullResponse: (typeof options.resolveWithFullResponse === 'undefined') ? true : options.resolveWithFullResponse,
                headers: Object.assign({ 'X-Requested-With': 'XMLHttpRequest', Referer: (typeof options.referer !== 'undefined') ? options.referer : Helper.uris.base, Cookie: (typeof options.cookie !== 'undefined') ? options.cookie : (this.credit ? `LEETCODE_SESSION=${this.credit.session};csrftoken=${this.credit.csrfToken}` : '') }, options.extra),
                form: options.form,
                body: JSON.stringify(options.body) || '',
            });
        });
    }
    // extract key from cookies
    static parseCookies(cookies, key) {
        if (!cookies) {
            return '';
        }
        const reg = new RegExp(`${key}=(\.+?);`);
        for (const itr of cookies) {
            const res = itr.match(reg);
            if (res) {
                return res[1].trim();
            }
        }
        return '';
    }
    static GraphQlRequest(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = new graphql_request_1.GraphQLClient(Helper.uris.graphql, {
                headers: {
                    Orgin: options.origin || Helper.uris.base,
                    Referer: options.referer || Helper.uris.base,
                    cookie: this.credit ? `LEETCODE_SESSION=${this.credit.session};csrftoken=${this.credit.csrfToken}` : '',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRFToken': Helper.credit.csrfToken,
                }
            });
            return yield client.request(options.query, options.variables || {});
        });
    }
    static difficultyMap(difficulty) {
        switch (difficulty) {
            case 1: return interfaces_1.ProblemDifficulty.Easy;
            case 2: return interfaces_1.ProblemDifficulty.Medium;
            case 3: return interfaces_1.ProblemDifficulty.Hard;
            default: return interfaces_1.ProblemDifficulty.Easy;
        }
    }
    static languageMap(language) {
        let extension;
        switch (language) {
            case 'python3':
                extension = 'py';
                break;
            case 'python':
                extension = 'py';
                break;
            case 'typescript':
                extension = 'ts';
                break;
            case 'javascript':
                extension = 'js';
                break;
            case 'rust':
                extension = 'rs';
                break;
            case 'kotlin':
                extension = 'kt';
                break;
            case 'golang':
                extension = 'go';
                break;
            case 'csharp':
                extension = 'cs';
                break;
            case 'ruby':
                extension = 'rb';
                break;
            default:
                extension = language;
                break;
        }
        return extension;
    }
    static statusMap(status) {
        switch (status) {
            case 'Accepted': return "A/C";
            case 'Time Limit Exceeded': return "TLE";
            case 'ac': return "A/C";
            case '10': return "AC";
            case '11': return "Wrong Answer";
            case '14': return "TLE";
            case '15': return "Runtime Error";
            case '20': return "Complie Error";
            default: return status;
        }
    }
    static switchEndPoint(endPoint) {
        let uris;
        if (endPoint === interfaces_1.Endpoint.US) {
            uris = config_1.default.uri.us;
        }
        else if (endPoint === interfaces_1.Endpoint.CN) {
            uris = config_1.default.uri.cn;
        }
        this.setUris(uris);
        problem_1.default.setUris(uris);
        leetcode_1.default.setUris(uris);
        submission_1.default.setUris(uris);
        Helper.setUris(uris);
    }
}
exports.Helper = Helper;
//# sourceMappingURL=helper.js.map