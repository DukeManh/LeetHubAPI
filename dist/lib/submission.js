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
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("../utils/helper");
class Submission {
    constructor(id, status, lang, runtime, timestamps, url, memory, code) {
        this.id = id;
        this.status = status;
        this.lang = lang;
        this.runtime = runtime;
        this.timestamps = timestamps;
        this.url = url;
        this.memory = memory;
        this.code = code;
    }
    static setUris(uris) {
        Submission.uris = uris;
    }
    detail() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield helper_1.Helper.HttpRequest({
                url: helper_1.Helper.uris.submission.replace("$id", this.id.toString()),
                method: "GET",
            });
            this.lang = response.match(/getLangDisplay:\s'([^']*)'/)[1];
            this.memory = response.match(/memory:\s'[^']*'/)[1];
            this.runtime = response.match(/runtime:\s'([^']*)'/)[1];
            this.status = helper_1.Helper.statusMap(response.match(/parseInt\('(\d+)', 10/)[1]);
            this.code = response.match(/submissionCode:\s'([^']*)'/)[1];
            return this;
        });
    }
}
exports.default = Submission;
//# sourceMappingURL=submission.js.map