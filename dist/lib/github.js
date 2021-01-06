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
const helper_1 = require("../utils/helper");
const cheerio_1 = __importDefault(require("cheerio"));
const config_1 = __importDefault(require("./config"));
class Github {
    constructor(cookie, ghSess, dotcomUser, userSession, loggedIn, sessionSameSite) {
        this.cookie = cookie;
        this.ghSess = ghSess;
        this.dotcomUser = dotcomUser;
        this.userSession = userSession;
        this.loggedIn = loggedIn;
        this.sessionSameSite = sessionSameSite;
    }
    updateCred(cookies) {
        this.ghSess = helper_1.Helper.parseCookies(cookies, '_gh_sess');
        this.userSession = helper_1.Helper.parseCookies(cookies, 'user_session');
        this.sessionSameSite = helper_1.Helper.parseCookies(cookies, '__Host-user_session_same_site');
        this.cookie = `_gh_sess=${this.ghSess};dotcom_user=${this.dotcomUser};logged_in=${this.loggedIn};
                        user_session=${this.userSession};__Host-user_session_same_site=${this.sessionSameSite}`;
    }
    newRepo(name, visibility = 'public', description = '') {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = yield helper_1.Helper.HttpRequest({
                    url: config_1.default.gitHub.new,
                    method: 'GET',
                    cookie: this.cookie,
                    referer: config_1.default.gitHub.base
                });
                this.dotcomUser = helper_1.Helper.parseCookies([this.cookie], 'dotcom_user');
                this.loggedIn = helper_1.Helper.parseCookies([this.cookie], 'logged_in');
                this.updateCred(res.headers['set-cookie']);
                const $ = cheerio_1.default.load(res.body);
                const authenticityToken = $('form[id=new_repository] input[name=authenticity_token]').attr('value');
                const owner = $('input[name=owner]').attr('value');
                let location = '';
                res = yield helper_1.Helper.HttpRequest({
                    url: config_1.default.gitHub.repositories,
                    referer: config_1.default.gitHub.new,
                    method: 'POST',
                    cookie: this.cookie,
                    followAllRedirects: false,
                    followRedirect: false,
                    extra: {
                        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                    },
                    form: {
                        authenticity_token: authenticityToken,
                        owner,
                        'repository[name]': name,
                        'repository[visibility]': visibility,
                        'repository[description]': description,
                        'repository[auto_init]': false,
                        'repository[gitignore_template]': '',
                        'repository[license_template]': ''
                    }
                }).catch(redirect => {
                    if (redirect.response.statusCode === 302) {
                        this.updateCred(redirect.response.headers['set-cookie']);
                        location = redirect.response.headers.location;
                    }
                    else {
                        throw new Error(redirect.response.headers.status);
                    }
                });
                if (!location) {
                    throw new Error(`Could not create repo ${name}`);
                }
                return location;
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    commitNewFile(submission, url, questionTitle, questionSlug, message, description) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = yield helper_1.Helper.HttpRequest({
                    url: url + '/new/main',
                    method: 'GET',
                    cookie: this.cookie,
                    referer: config_1.default.gitHub.base
                });
                this.updateCred(res.headers['set-cookie']);
                const $ = cheerio_1.default.load(res.body);
                const authenticityToken = $(`form[action=${url.replace('https://github.com', '').replace(/\//g, '\\\/')}\\/create\\/main] input[name=authenticity_token]`).attr('value');
                const commit = $('input[class=js-commit-oid]').attr('value');
                const filename = questionSlug + '.' + helper_1.Helper.languageMap(submission.lang);
                let location;
                res = yield helper_1.Helper.HttpRequest({
                    url: url + '/create/main',
                    method: 'POST',
                    followAllRedirects: false,
                    followRedirect: false,
                    referer: '',
                    cookie: this.cookie,
                    form: {
                        authenticity_token: authenticityToken,
                        filename,
                        new_filename: `src/${questionTitle}/${filename}`,
                        content_changed: true,
                        value: submission.code,
                        message,
                        placeholder_message: `Leetcode #${submission.id} solution`,
                        description,
                        'commit-choice': 'direct',
                        'target-branch': 'main',
                        commit,
                        same_repo: 1,
                        pr: '',
                        quick_pull: '',
                    }
                }).catch(redirect => {
                    if (redirect.response.statusCode === 302) {
                        this.updateCred(redirect.response.headers['set-cookie']);
                        location = redirect.response.headers.location;
                    }
                    else {
                        throw new Error(redirect.response.headers.status);
                    }
                });
                if (!location) {
                    throw new Error(`An error has occured, file ${filename} could not be commited, try again.`);
                }
                return location;
            }
            catch (err) {
                throw new Error(err);
            }
        });
    }
}
exports.default = Github;
//# sourceMappingURL=github.js.map