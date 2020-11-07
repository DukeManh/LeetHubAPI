import { Helper } from '../utils/helper';
import { Uris, Credit, Endpoint } from '../utils/interfaces';
import { StatusCodeError } from 'request-promise-native/errors';

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
        const credit: Credit = await this.login(username, password);
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
        const response = await Helper.HttpRequest({
            url: Leetcode.uris.login,
            method: "GET",
            resolveWithFullResponse: true,
        });

        const token: string = Helper.parseCookies(response.headers['set-cookie'], 'csrftoken');

        let credit: Credit = {
            csrfToken: token
        }
        return null;
    }

}


export default Leetcode;