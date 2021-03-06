import request from 'request-promise-native';
import { HttpRequestOptions, Uris, Credit, GraphQLOptions, ProblemDifficulty, SubmissionStatus, Endpoint } from './interfaces';
import { GraphQLClient } from 'graphql-request';
import config from '../lib/config';
import submission from '../lib/submission';
import problem from '../lib/problem';
import leetcode from '../lib/leetcode';


class Helper {

    static uris: Uris;
    static credit: Credit;

    static setCredit(credit: Credit): void {
        Helper.credit = credit;
    }
    static setUris(uris: Uris): void {
        Helper.uris = uris;
    }

    // http request with options
    static async HttpRequest(options: HttpRequestOptions): Promise<any> {
        return await request({
            method: options.method || 'GET',
            uri: options.url,
            followRedirect: options.followRedirect,
            followAllRedirects: options.followAllRedirects,
            resolveWithFullResponse: (typeof options.resolveWithFullResponse === 'undefined') ? true : options.resolveWithFullResponse,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                Referer: (typeof options.referer !== 'undefined') ? options.referer : Helper.uris.base,
                Cookie: (typeof options.cookie !== 'undefined') ? options.cookie : (this.credit ? `LEETCODE_SESSION=${this.credit.session};csrftoken=${this.credit.csrfToken}` : ''),
                ...options.extra,
            },
            form: options.form,
            body: JSON.stringify(options.body) || '',
        });
    }

    // extract key from cookies
    static parseCookies(cookies: string[], key: string): string {
        if (!cookies) {
            return '';
        }
        const reg: RegExp = new RegExp(`${key}=(\.+?);`);
        for (const itr of cookies) {
            const res = itr.match(reg);
            if (res) {
                return res[1].trim();
            }
        }
        return '';
    }

    static async GraphQlRequest(options: GraphQLOptions): Promise<any> {
        const client = new GraphQLClient(
            Helper.uris.graphql,
            {
                headers: {
                    Orgin: options.origin || Helper.uris.base,
                    Referer: options.referer || Helper.uris.base,
                    cookie: this.credit ? `LEETCODE_SESSION=${this.credit.session};csrftoken=${this.credit.csrfToken}` : '',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRFToken': Helper.credit.csrfToken,
                }
            }
        );

        return await client.request(
            options.query,
            options.variables || {},
        );
    }

    static difficultyMap(difficulty: number): ProblemDifficulty {
        switch (difficulty) {
            case 1: return ProblemDifficulty.Easy;
            case 2: return ProblemDifficulty.Medium;
            case 3: return ProblemDifficulty.Hard;
            default: return ProblemDifficulty.Easy;
        }
    }

    static languageMap(language: string): string {
        let extension: string;
        switch (language) {
            case 'python3':
                extension = 'py'
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

    static statusMap(status: string): string {
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

    static switchEndPoint(endPoint: Endpoint): void {
        let uris: Uris;
        if (endPoint === Endpoint.US) {
            uris = config.uri.us;
        }
        else if (endPoint === Endpoint.CN) {
            uris = config.uri.cn;
        }
        this.setUris(uris);
        problem.setUris(uris);
        leetcode.setUris(uris);
        submission.setUris(uris);
        Helper.setUris(uris);
    }
}

export { Helper };