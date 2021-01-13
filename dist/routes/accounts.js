"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const service_1 = require("../utils/service");
const Accounts = express_1.default.Router();
Accounts.use(body_parser_1.default.urlencoded({ extended: true }));
Accounts.use(body_parser_1.default.json());
Accounts.route('/')
    .get((req, res, next) => {
    const session = req.session;
    if (session.csrfToken && session.session) {
        service_1.build({
            session: session.session,
            csrfToken: session.csrfToken,
            githubCookie: session.ghCookie
        }, session.endpoint)
            .then(user => {
            res.status(200).json(user);
        })
            .catch(err => {
            res.status(401).send(err);
        });
    }
    else {
        res.status(401).send('Authorization failed');
    }
});
Accounts.route('/login')
    .post((req, res, next) => {
    service_1.login(req.body)
        .then(user => {
        const session = {
            csrfToken: user.credit.csrfToken,
            session: user.credit.session,
            ghCookie: user.credit.githubCookie,
            username: user.userStatus.username,
            endpoint: user.userStatus.requestRegion,
        };
        req.session = session;
        res.status(200).json(user);
    })
        .catch(err => {
        res.status(401).send(err);
    });
});
Accounts.route('/logout')
    .get((req, res, next) => {
    service_1.logout();
    req.session = null;
    res.end();
});
exports.default = Accounts;
//# sourceMappingURL=accounts.js.map