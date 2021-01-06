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
const cheerio_1 = __importDefault(require("cheerio"));
const config_1 = __importDefault(require("./config"));
const ghCookie = '_gh_sess=evBRuaFCynO0bTfE9pO8Ctx%2Bwiu5L2S7uX%2BfysuQiiDHRnpIGAy7lrZe7f1qcELqB2g3%2Fun8RRrNe1ff0%2Bcl2H8gcJGdY8Mr%2B7hi8ex%2BXSWFGEY%2FoQe9mmpV2gA7x%2FSddOKDRhJBf6yoZEbeG0VNQl%2FTXsPppTtLuS8YvMZItKhTi4QPOpSI12gKn0NrMMnrGcSWUHKGf%2Fxc%2FNHupt1LI2OGwXjtPtMrTC3EKEFffJzS%2BnaY5Sj0F0w6u6IvgllFu2i08cubvvsNWoTKHtjSGs0%2FBFXm3GxaIqvrEII1KFTSqfyA8CxdzYP4df39FcofoYkzw2TqMzT1r%2FJFEdHF2%2B4x4oljr3eP9E%2Fzt1XHUOIxJUjw7IYBkoP4PzQ8njH7G7UXWC3E0%2BtzyAj%2FKLMUvRHDcd6Ycwzm6SI%2Bv2DIXEAmhLOdSa%2Fbzzqvja8gE9Ky9ViBYtQ64zDqOodJ560JiXabjabQJ%2BUj1WGWWbKONYqSU7L0Ifl4sJcbfF3vJh6qRoy4IjFWrO8mky8J6KJg%2Bg5jYyekDAxT9QvUNeSD%2BKQCsL6WFiwGf1ixx7O2EEzGU6ur8ge4nET2jhRoO2lxOCbi766r987zieBVdaC6Irn21eVzf1zqWEBavVxShizrHytimuySr8uDiF67nhL0PFbz5WCv6ew6aZccgUIcQmiHJMVwpABS3I%2FaVL9kq4Yf1jclsAD3ra6j1XsUpkDlLca%2B2MmIyTtYKqKfwoDTLFiEiP2t2fKVkFhsr0o2jWx6BFHOSFw1vztLqLkIPAo5aWQ6zfjb0Ak8WyaCFkXPqRmISwvvd1U3r1AwqmEMuTIIFVOtdRtugXUyINaVWxXS1iL8iMrggVWpMOeg8e1Y%2BuVwi3t5aGy5PgSmFsomfScrS%2Fjr12%2FfpFIFa3W8vXPexRAHndTF7bYFrazkEbW%2F8b27UbI8KjNp1KLigp6rZ0mTllHhK3YgBwCpiJcQ--Yh5HlcPi3MivDPWB--SXMpwcsko1bS1EZjN0EcOQ%3D%3D;dotcom_user=DukeManh;logged_in=yes;user_session=2g9APbRqpT3pc4i-aPS8HV_TwJeVTmvGpN0w44XZC7ZGFJyo';
class Github {
    constructor(cookie, ghSess, dotcomUser, userSession, loggedIn, sessionSameSite) {
        this.cookie = cookie;
        this.ghSess = ghSess;
        this.dotcomUser = dotcomUser;
        this.userSession = userSession;
        this.loggedIn = loggedIn;
        this.sessionSameSite = sessionSameSite;
    }
    updateCred(cookies) {
        this.ghSess = helper_1.Helper.parseCookies(cookies, '_gh_sess');
        this.userSession = helper_1.Helper.parseCookies(cookies, 'user_session');
        this.sessionSameSite = helper_1.Helper.parseCookies(cookies, '__Host-user_session_same_site');
        this.cookie = `_gh_sess=${this.ghSess};dotcom_user=${this.dotcomUser};logged_in=${this.loggedIn};user_session=${this.userSession};__Host-user_session_same_site=${this.sessionSameSite}`;
    }
    newRepo(name, visibility = 'public', description = '') {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = yield helper_1.Helper.HttpRequest({
                    url: config_1.default.gitHub.new,
                    method: 'GET',
                    cookie: this.cookie,
                    referer: config_1.default.gitHub.base
                });
                this.dotcomUser = helper_1.Helper.parseCookies([this.cookie], 'dotcom_user');
                this.loggedIn = helper_1.Helper.parseCookies([this.cookie], 'logged_in');
                this.updateCred(res.headers['set-cookie']);
                const $ = cheerio_1.default.load(res.body);
                const authenticityToken = $('form[id=new_repository] input[name=authenticity_token]').attr('value');
                const owner = $('input[name=owner]').attr('value');
                let location = '';
                res = yield helper_1.Helper.HttpRequest({
                    url: config_1.default.gitHub.repositories,
                    referer: config_1.default.gitHub.new,
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
                    location = redirect.response.headers.location;
                    this.updateCred(redirect.response.headers['set-cookie']);
                });
                return location;
            }
            catch (error) {
                return new Error(error);
            }
        });
    }
    createNewFile(url, content, language) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
// const gh = new Github(`_gh_sess=JJRCzEYYeJ5KnjXGkFSw05mpdTb0Zp6%2F2t5TcJsMzDLiKOKP%2FKF%2FFx%2FE%2Bi26WEJIdCmZcwIaCh8lgZx%2BNCFrt%2FfA8vkuJXjDLpG%2F%2BlHIoIfCq13WKRAjUWuFFROQ1ptNi%2FHrTfTjBS5jxxXPVlZZP7IlEIS26qk%2FevUP8CwQ1PSjRTkPA91dQeai7hTmgWxfry9PxQKfptmwr67RIJuesgaFcBriXX5N9UWbOU6fzL3azRJRJdbndUsY%2B%2BEhBwu%2F53hfM35sMQ%2FnyM8Z9TOzeXPzSwiSm8gX0rWmD4Uc878taIVZdMRjOfsukjOeamalXIrpBW1IgcaSgY%2Fq5cKpgZq4bJ57e9lBDB9OPThxOn%2FqMyQOK6sqQM7z474qsgqcwo4ACZs8plZ2zTwME%2BFQrDx91d4vVUi4WD0BtvHroPkZdHjgMmIY4wh2fjsuMk1sDR4mVHV1SVNGgS0MUnO6qC8%2B0EwgiKQbe%2Bi7ed6Jdzn2xWASAFP1YFbjVjvnEgvGHeXt0z9Dr8hSNB6JcFq8a3fZfEj6fwOJHQps2Pu12GS9abjFFdy89n9r%2FL6Ey9IsF3%2FQ0Q4LYFPoPgpGf5aN9dsZQ99dFlPY%2FE2MiWkqcGKCZbBVcn1mcAxsWxSG2UVYJYTZ4EfOKG7HPFYdtu7L4Hwxyy8GO3suw6hrOz4RH0dCN4Kmmi9zcJzyLwe08l6%2BeiXIsGrzIi%2Fy8eAT2idLSE6mXqOYytcckI44KJqAsrjiSOxNcBg7t1YBbU9uWpsdkRWB7fUpzAijLY%2F6swDWfwMms%2FyXh3IuG8E5TJdfb4%2BDA1nbbnHDUfZ6LYIvQc4goAyEp%2F%2F8CoRrqGVOeMQ9QR%2F3ZbuE1qi9mWNu9eq4iPZvZcy24shsxDxj6KcQlELNvG32K0si5jWX1wUOUCUK6nhKcLjeqklN6I3k0WlF74ndUhqiz2PT%2F%2FhspvNq09KYzRprM%2FIt1iOCD4oyF1p6ryXnx2e%2FrloaM%2FZPEDUal2X2AkPsHSajFZozSPYWWuLAVUEyP2kzR4A2May2ZyjBSUttSUyt0IfdTBVZnw8KLNC9sC8JyFM9UBZ2cQrFfUtKG1BQZhb%2BrsFnFPrDFFmGKw%3D%3D--Ca26xLgSLI7Z9AFZ--jSTHW9BMRX0il1HBfe9PnQ%3D%3D;dotcom_user=DukeManh;logged_in=yes;user_session=qv9S38SVU8f92ZtD0GGMNimqmDkWwLyhuz_8Cam9fKFou5M9;__Host-user_session_same_site=qv9S38SVU8f92ZtD0GGMNimqmDkWwLyhuz_8Cam9fKFou5M9`);
// gh.newRepo()
//     .then(url => {
//         console.log(url);
//     })
//     .catch(err => {
//         console.log(err);
//     })
//# sourceMappingURL=github.js.map