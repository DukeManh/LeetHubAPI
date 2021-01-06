import { Helper } from '../utils/helper';
import cheerio from 'cheerio';
import config from './config';
import Submission from './submission';

export default class Github {
    constructor(public cookie: string,
        public ghSess?: string,
        public dotcomUser?: string,
        public userSession?: string,
        public loggedIn?: string,
        public sessionSameSite?: string,
    ) { }

    updateCred(cookies: string[]) {
        this.ghSess = Helper.parseCookies(cookies, '_gh_sess');
        this.userSession = Helper.parseCookies(cookies, 'user_session');
        this.sessionSameSite = Helper.parseCookies(cookies, '__Host-user_session_same_site');
        this.cookie = `_gh_sess=${this.ghSess};dotcom_user=${this.dotcomUser};logged_in=${this.loggedIn};user_session=${this.userSession};__Host-user_session_same_site=${this.sessionSameSite}`
    }

    async newRepo(name: string, visibility: string = 'public', description: string = ''): Promise<any> {
        try {
            let res = await Helper.HttpRequest({
                url: config.gitHub.new,
                method: 'GET',
                cookie: this.cookie,
                referer: config.gitHub.base
            });

            this.dotcomUser = Helper.parseCookies([this.cookie], 'dotcom_user');
            this.loggedIn = Helper.parseCookies([this.cookie], 'logged_in');

            this.updateCred(res.headers['set-cookie']);

            const $ = cheerio.load(res.body);
            const authenticityToken = $('form[id=new_repository] input[name=authenticity_token]').attr('value');
            const owner = $('input[name=owner]').attr('value');

            let location = '';

            res = await Helper.HttpRequest({
                url: config.gitHub.repositories,
                referer: config.gitHub.new,
                method: 'POST',
                cookie: this.cookie,
                followAllRedirects: false,
                followRedirect: false,
                extra: {
                    accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                },
                form: {
                    authenticity_token: authenticityToken,
                    owner,
                    'repository[name]': name,
                    'repository[visibility]': visibility,
                    'repository[description]': description,
                    'repository[auto_init]': false,
                    'repository[gitignore_template]': '',
                    'repository[license_template]': ''
                }
            }).catch(redirect => {
                if (redirect.response.statusCode === 302) {
                    this.updateCred(redirect.response.headers['set-cookie']);
                    location = redirect.response.headers.location;
                }
                else {
                    throw new Error(redirect.response.headers.status);
                }
            });

            if (!location) {
                throw new Error(`Could not create repo ${name}`);
            }

            return location;
        } catch (error) {
            throw new Error(error);
        }
    }

    async commitNewFile(submission: Submission, url: string, questionTitle: string, questionSlug: string, message: string, description: string): Promise<string> {
        try {
            let res = await Helper.HttpRequest({
                url: url + '/new/main',
                method: 'GET',
                cookie: this.cookie,
                referer: config.gitHub.base
            });

            this.updateCred(res.headers['set-cookie']);

            const $ = cheerio.load(res.body);
            const authenticityToken = $(`form[action=${url.replace('https://github.com', '').replace(/\//g, '\\\/')}\\/create\\/main] input[name=authenticity_token]`).attr('value');
            const commit = $('input[class=js-commit-oid]').attr('value');

            const filename = questionSlug + '.' + Helper.languageMap(submission.lang);

            let location: string;
            res = await Helper.HttpRequest({
                url: url + '/create/main',
                method: 'POST',
                followAllRedirects: false,
                followRedirect: false,
                referer: '',
                cookie: this.cookie,
                form: {
                    authenticity_token: authenticityToken,
                    filename,
                    new_filename: `src/${questionTitle}/${filename}`,
                    content_changed: true,
                    value: submission.code,
                    message,
                    placeholder_message: `Leetcode #${submission.id} solution`,
                    description,
                    'commit-choice': 'direct',
                    'target-branch': 'main',
                    commit,
                    same_repo: 1,
                    pr: '',
                    quick_pull: '',
                }
            }).catch(redirect => {
                if (redirect.response.statusCode === 302) {
                    this.updateCred(redirect.response.headers['set-cookie']);
                    location = redirect.response.headers.location;
                }
                else {
                    throw new Error(redirect.response.headers.status);
                }
            })

            if (!location) {
                throw new Error(`An error has occured, file ${filename} could not be commited, try again.`);
            }

            return location;
        }
        catch (err) {
            throw new Error(err);
        }
    }
}
