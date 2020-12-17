"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const service_1 = require("../utils/service");
const Accounts = express_1.default.Router();
Accounts.use(body_parser_1.default.urlencoded({ extended: true }));
Accounts.use(body_parser_1.default.json());
Accounts.use(cookie_parser_1.default());
var leetcode;
Accounts.route('/')
    .get((req, res, next) => {
    let cookie = req.cookies;
    if (cookie.csrftoken && cookie.session) {
        service_1.build({
            session: cookie.session,
            csrfToken: cookie.csrftoken
        }, cookie.endpoint)
            .then(user => {
            console.log(user);
            res.status(200).json(user);
        })
            .catch(err => res.status(401).send());
    }
    else {
        res.status(401).send();
    }
});
Accounts.route('/login')
    .post((req, res, next) => {
    service_1.login(req.body)
        .then(user => {
        res.cookie('csrftoken', user.credit.csrfToken);
        res.cookie('session', user.credit.session);
        res.cookie('username', user.userStatus.username);
        res.cookie('endpoint', user.userStatus.requestRegion);
        res.json(user);
    })
        .catch(err => res.status(401).send(err));
});
Accounts.route('/logout')
    .get((req, res, next) => {
    service_1.logout();
    res.clearCookie('LeetcodeCookie');
    res.status(200).send();
});
exports.default = Accounts;
//# sourceMappingURL=accounts.js.map