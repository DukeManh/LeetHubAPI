import Express from 'express';
import bodyParser from 'body-parser';
import Github from '../lib/github';
import Submission from '../lib/submission';

const Repo = Express.Router();
Repo.use(bodyParser.urlencoded({ extended: true }))
Repo.use(bodyParser.json());

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
        const gh = new Github(req.session.ghCookie);
        gh.newRepo(req.body.values.repoName)
            .then((response) => {
                req.session.ghCookie = response.cookie;
                res.status(200).json({ url: response.url });
            })
            .catch(err => {
                res.status(400).send(err.message);
            })
    });

Repo.route('/commit')
    .post((req, res, next) => {
        const gh = new Github(req.session.ghCookie);
        const body = req.body;
        const sub = body.sub;
        const submission = new Submission(sub.id, sub.status, sub.lang, sub.runtime, sub.timestamps, sub.url, sub.memory, sub.code);
        gh.commitNewFile(submission, body.url, body.frontendId, body.title, body.slug, body.message, body.description)
            .then((response) => {
                req.session = {
                    ...req.session,
                    ghCookie: response.cookie
                }
                res.status(200).send();
            })
            .catch((err) => {
                res.status(400).send(err.message);
            })
    });


export default Repo;