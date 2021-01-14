"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const github_1 = __importDefault(require("../lib/github"));
const submission_1 = __importDefault(require("../lib/submission"));
const Repo = express_1.default.Router();
Repo.use(body_parser_1.default.urlencoded({ extended: true }));
Repo.use(body_parser_1.default.json());
Repo.use((req, res, next) => {
    if (req.session && req.session.ghCookie) {
        next();
    }
    else {
        res.status(401).send('Authorization failed');
    }
});
Repo.route('/newrepo')
    .post((req, res, next) => {
    const gh = new github_1.default(req.session.ghCookie);
    console.log(req.body);
    gh.newRepo(req.body.values.repoName)
        .then((response) => {
        req.session.ghCookie = response.cookie;
        res.status(200).json({ url: response.url });
    })
        .catch(err => {
        res.status(400).send(err.message);
    });
});
Repo.route('/commit')
    .post((req, res, next) => {
    const gh = new github_1.default(req.session.ghCookie);
    const body = req.body;
    const sub = body.sub;
    const submission = new submission_1.default(sub.id, sub.status, sub.lang, sub.runtime, sub.timestamps, sub.url, sub.memory, sub.code);
    gh.commitNewFile(submission, body.url, body.frontendId, body.title, body.slug, body.message, body.description)
        .then((response) => {
        req.session = Object.assign(Object.assign({}, req.session), { ghCookie: response.cookie });
        res.status(200).send();
    })
        .catch((err) => {
        res.status(400).send(err.message);
    });
});
exports.default = Repo;
//# sourceMappingURL=repos.js.map