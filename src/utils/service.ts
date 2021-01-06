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
    const user = await leetcode.getGlobalData().catch(err => { throw new Error(err) });
    const profile = await leetcode.getProfile(user.userStatus.username);
    return {
        credit: leetcode.Credit,
        ...user,
        ...profile.matchedUser.submitStats,
    };
};

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
    const user = await leetcode.getGlobalData().catch(err => { throw new Error(err) });
    if (!user.userStatus.username) {
        throw new Error('Cookies Expired');
    }
    const profile = await leetcode.getProfile(user.userStatus.username);
    return {
        credit: leetcode.Credit,
        ...user,
        ...profile.matchedUser.submitStats,
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