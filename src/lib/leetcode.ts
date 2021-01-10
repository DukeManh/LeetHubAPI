import { Helper } from '../utils/helper';
import { Uris, Credit, Endpoint, HttpRequestOptions } from '../utils/interfaces';
import { StatusCodeError } from 'request-promise-native/errors';
import cheerio from 'cheerio';
import config from './config';
import { gql } from 'graphql-request'

class Leetcode {
    session?: string;
    csrfToken: string;
    ghCookie?: string;

    static queries: any = {
        globalData: gql`
            query globalData {
                userCountryCode
                userStatus {
                    isPremium
                    username
                    realName
                    avatar
                }
            }`,
        userProfile: gql`
            query getUserProfile($username: String!) {
                matchedUser(username: $username) {
                    submitStats {
                        acSubmissionNum {
                            difficulty
                            count
                            submissions
                        }
                    }
                }
            }
            `,
    }
    static uris: Uris;
    static setUris(uris: Uris): void {
        Leetcode.uris = uris;
    }

    constructor(credit: Credit) {
        this.session = credit.session;
        this.csrfToken = credit.csrfToken;
        this.ghCookie = credit.githubCookie;
    }

    get Credit(): Credit {
        return {
            session: this.session,
            csrfToken: this.csrfToken,
            githubCookie: this.ghCookie
        }
    }

    static async build(username: string, password: string, endpoint: Endpoint): Promise<Leetcode> {
        Helper.switchEndPoint(endpoint);
        let credit: Credit;
        if (endpoint === Endpoint.CN) {
            credit = await this.login(username, password).catch(err => {
                throw new Error(err);
            });
        }
        else {
            credit = await this.loginWithGitHub(username, password).catch(err => {
                throw new Error(err);
            });
        }
        Helper.setCredit(credit);
        return new Leetcode(credit);
    }

    static async login(username: string, password: string): Promise<Credit> {
        // get crsftoken for login
        const response = await Helper.HttpRequest({
            url: Leetcode.uris.login,
            method: "GET",
            resolveWithFullResponse: true,
        });

        const token: string = Helper.parseCookies(response.headers['set-cookie'], 'csrftoken');

        let credit: Credit = {
            csrfToken: token
        }


        // attempt login
        try {
            const loginResponse = await Helper.HttpRequest({
                url: Helper.uris.login,
                method: 'POST',
                // leetcode login form
                form: {
                    csrfmiddlewaretoken: token,
                    login: username,
                    password,
                },
                resolveWithFullResponse: true,
            });

            const session = Helper.parseCookies(loginResponse.headers['set-cookie'], 'LEETCODE_SESSION');
            const csrfToken = Helper.parseCookies(loginResponse.headers['set-cookie'], 'csrftoken');

            credit = {
                session,
                csrfToken,
            }

        } catch (error) {
            if (error instanceof StatusCodeError) {
                throw new Error("Login failed");
            }
        }
        return credit;
    }

    static async loginWithGitHub(username: string, password: string): Promise<Credit> {
        try {
            let credit: Credit;
            // fetch login page
            const githubResponse = await Helper.HttpRequest({
                url: config.gitHub.login,
                method: "GET",
                extra: {
                    "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36 OPR/72.0.3815.186", "accept-language": "en-US,en;q=0.5",
                    "cache-control": "max-age=0",
                    accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                },
                referer: config.gitHub.base
            });

            // get authenticty token and gh_sess
            const $ = cheerio.load(githubResponse.body);
            let ghSess: string = Helper.parseCookies(githubResponse.headers['set-cookie'], '_gh_sess');
            const authenticityToken: string = $('input[name=authenticity_token]').attr('value');
            const commit = "Sign in";

            let cookie = `_gh_sess=${ghSess};logged_in=no;`;
            let dotcomUser: string;
            let loggedIn: string;
            let userSession: string;

            // login with Github usename and password
            const gitHubLogin = await Helper.HttpRequest({
                url: config.gitHub.session,
                method: "POST",
                referer: config.gitHub.login,
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
            }).catch(res => { // 302 redirect
                // parse ghSess, dotcomUser, loggedIn, useSession
                ghSess = Helper.parseCookies(res.response.headers['set-cookie'], '_gh_sess');
                dotcomUser = Helper.parseCookies(res.response.headers['set-cookie'], 'dotcom_user');
                loggedIn = Helper.parseCookies(res.response.headers['set-cookie'], 'logged_in');
                userSession = Helper.parseCookies(res.response.headers['set-cookie'], 'user_session')
            });

            const gitHubCookie = `_gh_sess=${ghSess}; dotcom_user=${dotcomUser};logged_in=${loggedIn};user_session=${userSession};`

            // fetch leetcode login page
            let response = await Helper.HttpRequest({
                url: Leetcode.uris.login,
                method: "GET",
            });

            // leetcode csrfToken
            let token: string = Helper.parseCookies(response.headers['set-cookie'], 'csrftoken');

            let leetcodeSession: string;
            let location: string;
            let referer: string;
            cookie = `csrftoken=${token};LEETCODE_SESSION=${leetcodeSession};`;

            // github leetcode oauth
            response = await Helper.HttpRequest({
                url: config.gitHub.authorize,
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
                    leetcodeSession = Helper.parseCookies(redirect.response.headers['set-cookie'], 'LEETCODE_SESSION');
                    token = Helper.parseCookies(redirect.response.headers['set-cookie'], 'csrftoken');
                    location = redirect.response.headers.location;
                    cookie = gitHubCookie
                });

            // authenticate github
            response = await Helper.HttpRequest({
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
                    ghSess = Helper.parseCookies(redirect2.response.headers['let-cookie'], '_gh_sess');
                    userSession = Helper.parseCookies(redirect2.response.headers['let-cookie'], 'user_session')
                    referer = location;
                    location = redirect2.response.headers.location;
                    cookie = `csrftoken=${token};LEETCODE_SESSION=${leetcodeSession};`;
                });

            response = await Helper.HttpRequest({
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
                    leetcodeSession = Helper.parseCookies(redirect3.response.headers['set-cookie'], 'LEETCODE_SESSION');
                    token = Helper.parseCookies(redirect3.response.headers['set-cookie'], 'csrftoken');
                    credit = {
                        session: leetcodeSession,
                        csrfToken: token,
                        githubCookie: gitHubCookie
                    }
                })
            return credit;
        }
        catch (err) {
            throw new Error(err);
        }
    }

    async getGlobalData(): Promise<any> {
        return await Helper.GraphQlRequest({
            query: Leetcode.queries.globalData
        })
    }

    async getProfile(username: string): Promise<any> {
        const response: any = await Helper.GraphQlRequest({
            query: Leetcode.queries.userProfile,
            variables: {
                username
            }
        });
        return response;
    }

}

export default Leetcode;