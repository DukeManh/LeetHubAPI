"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const github_1 = __importDefault(require("../lib/github"));
const submission_1 = __importDefault(require("../lib/submission"));
const Repo = express_1.default.Router();
Repo.use((req, res, next) => {
    if (req.session && req.session.ghCookie) {
        next();
    }
    else {
        res.status(401).send('Authorized');
    }
});
Repo.route('/create')
    .post((req, res, next) => {
    const gh = new github_1.default(req.session.ghCookie);
    gh.newRepo(req.body.repoName)
        .then((response) => {
        req.session.ghCookie = response.cookie;
        res.status(200).json({ url: response.url });
    })
        .catch(err => {
        res.status(400).send(err);
    });
});
Repo.route('/commit')
    .post((req, res, next) => {
    const gh = new github_1.default(req.session.ghCookie);
    const body = req.body;
    gh.commitNewFile(new submission_1.default(body.id), body.url, body.title, body.slug, body.commit)
        .then((response) => {
        req.session.ghCookie = response.cookie;
        res.status(200).send();
    })
        .catch((err) => {
        res.status(400).send(err);
    });
});
//# sourceMappingURL=Repos.js.map