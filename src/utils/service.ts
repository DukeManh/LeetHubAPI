import { Helper } from './helper'
import { Endpoint } from './interfaces';
import Leetcode from '../lib/leetcode';
import Submission from '../lib/submission';
import { Credit, Uris } from './interfaces';
import config from '../lib/config';

let helper: Helper;

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
    let leetcode: Leetcode = new Leetcode(credit);
    Leetcode.setUris((endpoint === 'US' ? config.uri.us : config.uri.cn));
    const globalData = await leetcode.getGlobalData().catch(err => { throw new Error(err) });
    return {
        credit: leetcode.Credit,
        ...globalData
    };
}

function logout() {
    Helper.uris = null;
    Helper.credit = null;
}

async function fetchSubs(): Promise<any> {
    const response: any = await Helper.HttpRequest({
        url: Helper.uris.problemsAll,
        method: 'GET',
        resolveWithFullResponse: true,
        referer: Helper.uris.problemSet
    }).catch(err => { return new Error(err); });

    return JSON.parse(response.body);
}

async function getSubList(id: number): Promise<Submission> {
    let sub: Submission = new Submission(id);
    return await sub.detail();
}

export { fetchSubs, login, logout, getSubList };