import { Helper } from './helper'
import { Endpoint } from './interfaces';
import Leetcode from '../lib/leetcode';
import { Credit } from './interfaces';
import config from '../lib/config';

async function login({ username, password, end }): Promise<any> {
    let endpoint: Endpoint;
    if (end === 'CN') {
        endpoint = Endpoint.CN;
    }
    else {
        endpoint = Endpoint.US;
    }
    const leetcode: Leetcode = await Leetcode.build(username, password, endpoint).catch(err => { throw new Error(err) });
    const globalData = await leetcode.getGlobalData().catch(err => { throw new Error(err) });
    return {
        credit: leetcode.Credit,
        ...globalData
    };
}

export async function build(credit: Credit, endpoint: string) {
    const leetcode: Leetcode = new Leetcode(credit);
    let end: Endpoint;
    if (endpoint === 'CN') {
        end = Endpoint.CN;
    }
    else {
        end = Endpoint.US;
    }
    Leetcode.setUris(config.uri[endpoint]);
    Helper.switchEndPoint(end);
    Helper.setCredit(credit);
    const globalData = await leetcode.getGlobalData().catch(err => { throw new Error(err) });
    if (!globalData.userStatus.username) {
        throw new Error('Cookies Expired');
    }
    return {
        credit: leetcode.Credit,
        ...globalData
    };
}

function logout() {
    Helper.uris = null;
    Helper.credit = null;
}

async function fetchQuestions(): Promise<any> {
    const response: any = await Helper.HttpRequest({
        url: Helper.uris.problemsAll + '?status=Solved',
        method: 'GET',
        resolveWithFullResponse: true,
        referer: Helper.uris.problemSet
    }).catch(err => { return new Error(err); });

    return JSON.parse(response.body);
}

export { fetchQuestions, login, logout }