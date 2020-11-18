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
const interfaces_1 = require("../utils/interfaces");
const errors_1 = require("request-promise-native/errors");
const cheerio_1 = __importDefault(require("cheerio"));
const config_1 = __importDefault(require("./config"));
class Leetcode {
    constructor(credit) {
        this.session = credit.session;
        this.csrfToken = credit.csrfToken;
    }
    static setUris(uris) {
        Leetcode.uris = uris;
    }
    get Credit() {
        return {
            session: this.session,
            csrfToken: this.csrfToken
        };
    }
    static build(username, password, endpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            helper_1.Helper.switchEndPoint(endpoint);
            let credit;
            if (endpoint === interfaces_1.Endpoint.CN) {
                credit = yield this.login(username, password);
            }
            else {
                credit = yield this.loginWithGitHub(username, password);
            }
            helper_1.Helper.setCredit(credit);
            return new Leetcode(credit);
        });
    }
    static login(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            // get crsftoken for login
            const response = yield helper_1.Helper.HttpRequest({
                url: Leetcode.uris.login,
                method: "GET",
                resolveWithFullResponse: true,
            });
            const token = helper_1.Helper.parseCookies(response.headers['set-cookie'], 'csrftoken');
            let credit = {
                csrfToken: token
            };
            // attempt login
            try {
                const loginResponse = yield helper_1.Helper.HttpRequest({
                    url: helper_1.Helper.uris.login,
                    method: 'POST',
                    // leetcode login form
                    form: {
                        csrfmiddlewaretoken: token,
                        login: username,
                        password,
                    },
                    resolveWithFullResponse: true,
                });
                const session = helper_1.Helper.parseCookies(loginResponse.headers['set-cookie'], 'LEETCODE_SESSION');
                const csrfToken = helper_1.Helper.parseCookies(loginResponse.headers['set-cookie'], 'csrftoken');
                credit = {
                    session,
                    csrfToken,
                };
            }
            catch (error) {
                if (error instanceof errors_1.StatusCodeError) {
                    throw new Error("Login failed");
                }
            }
            return credit;
        });
    }
    static loginWithGitHub(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let credit;
            // fetch github login page
            const githubResponse = yield helper_1.Helper.HttpRequest({
                url: config_1.default.gitHub.login,
                method: "GET",
                resolveWithFullResponse: true,
                extra: {
                    "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36 OPR/72.0.3815.186",
                    "accept-language": "en-US,en;q=0.5",
                    "cache-control": "max-age=0",
                    accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                },
                referer: config_1.default.gitHub.base
            });
            const $ = cheerio_1.default.load(githubResponse.body);
            let ghSess = helper_1.Helper.parseCookies(githubResponse.headers['set-cookie'], '_gh_sess');
            const authenticityToken = $('input[name=authenticity_token]').attr('value');
            const commit = "Sign in";
            let cookie = `_gh_sess=${ghSess}; logged_in=no`;
            let dotcomUser;
            let loggedIn;
            let userSession;
            const gitHubLogin = yield helper_1.Helper.HttpRequest({
                url: config_1.default.gitHub.session,
                method: "POST",
                referer: config_1.default.gitHub.login,
                resolveWithFullResponse: true,
                cookie,
                extra: {
                    accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                },
                form: {
                    commit,
                    login: username,
                    password,
                    authenticity_token: authenticityToken,
                },
                followRedirect: false,
                followAllRedirects: false,
            }).catch(res => {
                ghSess = helper_1.Helper.parseCookies(res.response.headers['set-cookie'], '_gh_sess');
                dotcomUser = helper_1.Helper.parseCookies(res.response.headers['set-cookie'], 'dotcom_user');
                loggedIn = helper_1.Helper.parseCookies(res.response.headers['set-cookie'], 'logged_in');
                userSession = helper_1.Helper.parseCookies(res.response.headers['set-cookie'], 'user_session');
            });
            let response = yield helper_1.Helper.HttpRequest({
                url: Leetcode.uris.login,
                method: "GET",
                resolveWithFullResponse: true,
            });
            let token = helper_1.Helper.parseCookies(response.headers['set-cookie'], 'csrftoken');
            let leetcodeSession;
            let location;
            let referer;
            cookie = `csrftoken=${token}; LEETCODE_SESSION=${leetcodeSession}`;
            response = yield helper_1.Helper.HttpRequest({
                url: config_1.default.gitHub.authorize,
                method: "GET",
                referer: this.uris.login,
                followRedirect: false,
                followAllRedirects: false,
                resolveWithFullResponse: true,
                cookie,
                extra: {
                    accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                }
            })
                .catch(redirect => {
                leetcodeSession = helper_1.Helper.parseCookies(redirect.response.headers['set-cookie'], 'LEETCODE_SESSION');
                location = redirect.response.headers.location;
                cookie = `_gh_sess=${ghSess};dotcome_user=${dotcomUser};logged_in=${loggedIn};user_session=${userSession}`;
            });
            response = yield helper_1.Helper.HttpRequest({
                url: location,
                method: "GET",
                referer: config_1.default.gitHub.authorize,
                resolveWithFullResponse: true,
                followAllRedirects: false,
                followRedirect: false,
                cookie,
            })
                .catch(redirect => {
                ghSess = helper_1.Helper.parseCookies(redirect.response.headers['set-cookie'], '_gh_sess');
                userSession = helper_1.Helper.parseCookies(redirect.response.headers['set-cookie'], 'user_session');
                referer = location;
                location = redirect.response.headers.location;
                cookie = `csrftoken=${token};LEETCODE_SESSION=${leetcodeSession}`;
            });
            response = yield helper_1.Helper.HttpRequest({
                url: location,
                method: "GET",
                resolveWithFullResponse: true,
                referer,
                followAllRedirects: false,
                followRedirect: false,
                cookie,
            }).catch(redirect3 => {
                leetcodeSession = helper_1.Helper.parseCookies(redirect3.response.headers['set-cookie'], 'LEETCODE_SESSION');
                token = helper_1.Helper.parseCookies(redirect3.response.headers['set-cookie'], 'csrftoken');
                credit = {
                    session: leetcodeSession,
                    csrfToken: token,
                };
            });
            return credit;
        });
    }
    getProfile() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield helper_1.Helper.GraphQlRequest({
                query: `
            {
                    user{
                        username
                    }
            }
            `,
            });
            return response.user;
        });
    }
}
exports.default = Leetcode;
//# sourceMappingURL=leetcode.js.map