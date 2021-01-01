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
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                Referer: options.referer || Helper.uris.base,
                Cookie: options.cookie ? options.cookie : (this.credit ? `LEETCODE_SESSION=${this.credit.session};csrftoken=${this.credit.csrfToken}` : ''),
                ...options.extra,
            },
            resolveWithFullResponse: options.resolveWithFullResponse,
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

    static statusMap(status: string): SubmissionStatus {
        switch (status) {
            case 'Accepted': return SubmissionStatus.Accepted;
            case 'ac': return SubmissionStatus.Accepted;
            case 'Compile Error': return SubmissionStatus['Compile Error'];
            case 'Time Limit Exceeded': return SubmissionStatus['Time Limit Exceeded'];
            case 'Wrong Answer': return SubmissionStatus['Wrong answer'];

            case '0': return SubmissionStatus.Accepted;
            case '1': return SubmissionStatus['Wrong Answer'];
            case '14': return SubmissionStatus['Time Limit Exceeded'];
            case '20': return SubmissionStatus['Compile Error'];

            default: return SubmissionStatus['Wrong answer'];
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