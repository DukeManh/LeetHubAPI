import { Helper } from '../utils/helper';
import { Uris, Credit, Endpoint, HttpRequestOptions } from '../utils/interfaces';
import { StatusCodeError } from 'request-promise-native/errors';
import cheerio from 'cheerio';
import config from './config';

class Leetcode {
    session?: string;
    csrfToken: string;

    static uris: Uris;
    static setUris(uris: Uris): void {
        Leetcode.uris = uris;
    }

    constructor(credit: Credit) {
        this.session = credit.session;
        this.csrfToken = credit.csrfToken;
    }

    get Credit(): Credit {
        return {
            session: this.session,
            csrfToken: this.csrfToken
        }
    }

    static async build(username: string, password: string, endpoint: Endpoint): Promise<Leetcode> {
        Helper.switchEndPoint(endpoint);
        let credit: Credit;
        if (endpoint === Endpoint.CN) {
            credit = await this.login(username, password);
        }
        else {
            credit = await this.loginWithGitHub(username, password);
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
        let credit: Credit;


        // fetch github login page
        const githubResponse = await Helper.HttpRequest({
            url: config.gitHub.login,
            method: "GET",
            resolveWithFullResponse: true,
            extra: {
                "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36 OPR/72.0.3815.186",
                "accept-language": "en-US,en;q=0.5",
                "cache-control": "max-age=0",
                accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            },
            referer: config.gitHub.base
        });

        const $ = cheerio.load(githubResponse.body);

        let ghSess: string = Helper.parseCookies(githubResponse.headers['set-cookie'], '_gh_sess');
        const authenticityToken: string = $('input[name=authenticity_token]').attr('value');
        const commit = "Sign in";

        let cookie = `_gh_sess=${ghSess}; logged_in=no`;
        let dotcomUser: string;
        let loggedIn: string;
        let userSession: string;

        const gitHubLogin = await Helper.HttpRequest({
            url: config.gitHub.session,
            method: "POST",
            referer: config.gitHub.login,
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
        }).catch(res => { // 302 redirect
            ghSess = Helper.parseCookies(res.response.headers['set-cookie'], '_gh_sess');
            dotcomUser = Helper.parseCookies(res.response.headers['set-cookie'], 'dotcom_user');
            loggedIn = Helper.parseCookies(res.response.headers['set-cookie'], 'logged_in');
            userSession = Helper.parseCookies(res.response.headers['set-cookie'], 'user_session')
        });

        let response = await Helper.HttpRequest({
            url: Leetcode.uris.login,
            method: "GET",
            resolveWithFullResponse: true,
        });

        let token: string = Helper.parseCookies(response.headers['set-cookie'], 'csrftoken');

        let leetcodeSession: string;
        let location: string;
        let referer: string;
        cookie = `csrftoken=${token}; LEETCODE_SESSION=${leetcodeSession}`;

        response = await Helper.HttpRequest({
            url: config.gitHub.authorize,
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
                leetcodeSession = Helper.parseCookies(redirect.response.headers['set-cookie'], 'LEETCODE_SESSION');
                location = redirect.response.headers.location;
                cookie = `_gh_sess=${ghSess};dotcome_user=${dotcomUser};logged_in=${loggedIn};user_session=${userSession}`;
            });


        response = await Helper.HttpRequest({
            url: location,
            method: "GET",
            referer: config.gitHub.authorize,
            resolveWithFullResponse: true,
            followAllRedirects: false,
            followRedirect: false,
            cookie,
        })
            .catch(redirect => {
                ghSess = Helper.parseCookies(redirect.response.headers['set-cookie'], '_gh_sess');
                userSession = Helper.parseCookies(redirect.response.headers['set-cookie'], 'user_session')
                referer = location;
                location = redirect.response.headers.location;
                cookie = `csrftoken=${token};LEETCODE_SESSION=${leetcodeSession}`;
            });

        response = await Helper.HttpRequest({
            url: location,
            method: "GET",
            resolveWithFullResponse: true,
            referer,
            followAllRedirects: false,
            followRedirect: false,
            cookie,
        }).catch(redirect3 => {
            leetcodeSession = Helper.parseCookies(redirect3.response.headers['set-cookie'], 'LEETCODE_SESSION');
            token = Helper.parseCookies(redirect3.response.headers['set-cookie'], 'csrftoken');
            credit = {
                session: leetcodeSession,
                csrfToken: token,
            }
        });

        return credit;
    }

    async getProfile(): Promise<string> {
        const response: any = await Helper.GraphQlRequest({
            query: `
            {
                    user{
                        username
                    }
            }
            `,
        });

        return response.user;
    }

}


export default Leetcode;