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
const leetcode_1 = __importDefault(require("./leetcode"));
const interfaces_1 = require("../utils/interfaces");
const helper_1 = require("../utils/helper");
const endpoint = interfaces_1.Endpoint.US;
const credit = {
    session: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfYXV0aF91c2VyX2lkIjoiMjM2OTI4MyIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImFsbGF1dGguYWNjb3VudC5hdXRoX2JhY2tlbmRzLkF1dGhlbnRpY2F0aW9uQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6Ijc4ZTk1YjU4ODljYjllYTRmNTM3NjNkNWY5OGM0NjUyMjE0Mzc3YjgiLCJpZCI6MjM2OTI4MywiZW1haWwiOiJtYW5oZHVjZGtjYkBnbWFpbC5jb20iLCJ1c2VybmFtZSI6IkR1a2VNYW5oIiwidXNlcl9zbHVnIjoiRHVrZU1hbmgiLCJhdmF0YXIiOiJodHRwczovL2Fzc2V0cy5sZWV0Y29kZS5jb20vdXNlcnMvZHVrZW1hbmgvYXZhdGFyXzE1ODk4NDE4ODQucG5nIiwicmVmcmVzaGVkX2F0IjoxNjA3NjU2ODI0LCJpcCI6IjIwOS4xNDEuMTk3LjEyMyIsImlkZW50aXR5IjoiIiwic2Vzc2lvbl9pZCI6NDg4Mzc4M30.UZNyCJnnIqKwIVocFpgaPgV6jaIjsMahi4jWk2ukreU",
    csrfToken: "rXGhCp3Pp798VbEug1v762yPj6a8TXeQAdjwinzsPGQivRllFsj6uzmPp3ocoDHG"
};
helper_1.Helper.switchEndPoint(endpoint);
helper_1.Helper.setCredit(credit);
const leet = new leetcode_1.default(credit);
function userInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield helper_1.Helper.HttpRequest({
            url: helper_1.Helper.uris.problemsAll,
            method: 'GET',
            resolveWithFullResponse: true,
            referer: helper_1.Helper.uris.problemSet
        });
        return JSON.parse(response.body);
    });
}
userInfo()
    .then((res) => {
    console.log(res.stat_status_pairs.filter(prob => prob.status !== null));
})
    .catch(err => console.log(err));
//# sourceMappingURL=test.js.map