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
const graphql_request_1 = require("graphql-request");
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
                credit = yield this.login(username, password).catch(err => {
                    throw new Error(err);
                });
            }
            else {
                credit = yield this.loginWithGitHub(username, password).catch(err => {
                    throw new Error(err);
                });
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
            try {
                let credit;
                // fetch login page
                const githubResponse = yield helper_1.Helper.HttpRequest({
                    url: config_1.default.gitHub.login,
                    method: "GET",
                    extra: {
                        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36 OPR/72.0.3815.186", "accept-language": "en-US,en;q=0.5",
                        "cache-control": "max-age=0",
                        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                    },
                    referer: config_1.default.gitHub.base
                });
                // get authenticty token and gh_sess
                const $ = cheerio_1.default.load(githubResponse.body);
                let ghSess = helper_1.Helper.parseCookies(githubResponse.headers['set-cookie'], '_gh_sess');
                const authenticityToken = $('input[name=authenticity_token]').attr('value');
                const commit = "Sign in";
                let cookie = `_gh_sess=${ghSess};logged_in=no;`;
                let dotcomUser;
                let loggedIn;
                let userSession;
                // login with Github usename and password
                const gitHubLogin = yield helper_1.Helper.HttpRequest({
                    url: config_1.default.gitHub.session,
                    method: "POST",
                    referer: config_1.default.gitHub.login,
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
                    // parse ghSess, dotcomUser, loggedIn, useSession
                    ghSess = helper_1.Helper.parseCookies(res.response.headers['set-cookie'], '_gh_sess');
                    dotcomUser = helper_1.Helper.parseCookies(res.response.headers['set-cookie'], 'dotcom_user');
                    loggedIn = helper_1.Helper.parseCookies(res.response.headers['set-cookie'], 'logged_in');
                    userSession = helper_1.Helper.parseCookies(res.response.headers['set-cookie'], 'user_session');
                });
                const gitHubCookie = `_gh_sess=${ghSess}; dotcom_user=${dotcomUser};logged_in=${loggedIn};user_session=${userSession};`;
                // fetch leetcode login page
                let response = yield helper_1.Helper.HttpRequest({
                    url: Leetcode.uris.login,
                    method: "GET",
                });
                // leetcode csrfToken
                let token = helper_1.Helper.parseCookies(response.headers['set-cookie'], 'csrftoken');
                let leetcodeSession;
                let location;
                let referer;
                cookie = `csrftoken=${token};LEETCODE_SESSION=${leetcodeSession};`;
                // github leetcode oauth
                response = yield helper_1.Helper.HttpRequest({
                    url: config_1.default.gitHub.authorize,
                    method: "GET",
                    referer: this.uris.login,
                    followRedirect: false,
                    followAllRedirects: false,
                    cookie,
                    extra: {
                        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36 OPR/72.0.3815.186",
                        "accept-language": "en-US,en;q=0.5",
                        "cache-control": "max-age=0",
                        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                    },
                })
                    .catch(redirect => {
                    leetcodeSession = helper_1.Helper.parseCookies(redirect.response.headers['set-cookie'], 'LEETCODE_SESSION');
                    token = helper_1.Helper.parseCookies(redirect.response.headers['set-cookie'], 'csrftoken');
                    location = redirect.response.headers.location;
                    cookie = gitHubCookie;
                });
                // authenticate github
                response = yield helper_1.Helper.HttpRequest({
                    url: location,
                    method: "GET",
                    referer: this.uris.login,
                    followAllRedirects: false,
                    followRedirect: false,
                    cookie,
                    extra: {
                        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                    }
                })
                    .catch(redirect2 => {
                    ghSess = helper_1.Helper.parseCookies(redirect2.response.headers['let-cookie'], '_gh_sess');
                    userSession = helper_1.Helper.parseCookies(redirect2.response.headers['let-cookie'], 'user_session');
                    referer = location;
                    location = redirect2.response.headers.location;
                    cookie = `csrftoken=${token};LEETCODE_SESSION=${leetcodeSession};`;
                });
                response = yield helper_1.Helper.HttpRequest({
                    url: location,
                    method: "GET",
                    referer,
                    followAllRedirects: false,
                    followRedirect: false,
                    cookie,
                    extra: {
                        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                    }
                })
                    .catch(redirect3 => {
                    leetcodeSession = helper_1.Helper.parseCookies(redirect3.response.headers['set-cookie'], 'LEETCODE_SESSION');
                    token = helper_1.Helper.parseCookies(redirect3.response.headers['set-cookie'], 'csrftoken');
                    credit = {
                        session: leetcodeSession,
                        csrfToken: token,
                        githubCookie: gitHubCookie
                    };
                });
                return credit;
            }
            catch (err) {
                throw new Error(err);
            }
        });
    }
    getGlobalData() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield helper_1.Helper.GraphQlRequest({
                query: Leetcode.queries.globalData
            });
        });
    }
    getProfile(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield helper_1.Helper.GraphQlRequest({
                query: Leetcode.queries.userProfile,
                variables: {
                    username
                }
            });
            return response;
        });
    }
}
Leetcode.queries = {
    globalData: graphql_request_1.gql `
            query globalData {
                userCountryCode
                userStatus {
                    isPremium
                    username
                    realName
                    avatar
                }
            }`,
    userProfile: graphql_request_1.gql `
            query getUserProfile($username: String!) {
                matchedUser(username: $username) {
                    username
                    githubUrl
                    profile {
                        realName
                        websites
                        countryName
                        skillTags
                        company
                        school
                        starRating
                        aboutMe
                        userAvatar
                        reputation
                        ranking
                        __typename
                    }
                    submitStats {
                        acSubmissionNum {
                            difficulty
                            count
                            submissions
                            __typename
                        }
                        totalSubmissionNum {
                            difficulty
                            count
                            submissions
                            __typename
                        }
                        __typename
                    }
                }
            }
            `,
};
exports.default = Leetcode;
//# sourceMappingURL=leetcode.js.map