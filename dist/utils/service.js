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
exports.logout = exports.login = exports.fetchQuestions = exports.build = void 0;
const helper_1 = require("./helper");
const interfaces_1 = require("./interfaces");
const leetcode_1 = __importDefault(require("../lib/leetcode"));
const config_1 = __importDefault(require("../lib/config"));
function login({ username, password, end }) {
    return __awaiter(this, void 0, void 0, function* () {
        let endpoint;
        if (end === 'CN') {
            endpoint = interfaces_1.Endpoint.CN;
        }
        else {
            endpoint = interfaces_1.Endpoint.US;
        }
        const leetcode = yield leetcode_1.default.build(username, password, endpoint).catch(err => { throw new Error(err); });
        const globalData = yield leetcode.getGlobalData().catch(err => { throw new Error(err); });
        return Object.assign({ credit: leetcode.Credit }, globalData);
    });
}
exports.login = login;
function build(credit, endpoint) {
    return __awaiter(this, void 0, void 0, function* () {
        const leetcode = new leetcode_1.default(credit);
        let end;
        if (endpoint === 'CN') {
            end = interfaces_1.Endpoint.CN;
        }
        else {
            end = interfaces_1.Endpoint.US;
        }
        leetcode_1.default.setUris(config_1.default.uri[endpoint]);
        helper_1.Helper.switchEndPoint(end);
        helper_1.Helper.setCredit(credit);
        const globalData = yield leetcode.getGlobalData().catch(err => { throw new Error(err); });
        if (!globalData.userStatus.username) {
            throw new Error('Cookies Expired');
        }
        return Object.assign({ credit: leetcode.Credit }, globalData);
    });
}
exports.build = build;
function logout() {
    helper_1.Helper.uris = null;
    helper_1.Helper.credit = null;
}
exports.logout = logout;
function fetchQuestions() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield helper_1.Helper.HttpRequest({
            url: helper_1.Helper.uris.problemsAll + '?status=Solved',
            method: 'GET',
            resolveWithFullResponse: true,
            referer: helper_1.Helper.uris.problemSet
        }).catch(err => { return new Error(err); });
        return JSON.parse(response.body);
    });
}
exports.fetchQuestions = fetchQuestions;
//# sourceMappingURL=service.js.map