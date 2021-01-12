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
        console.log(req.body);
        gh.newRepo(req.body.values.repoName)
            .then((response) => {
                req.session.ghCookie = response.cookie;
                res.status(200).json({ url: response.url });
            })
            .catch(err => {
                res.status(400).send(err);
            })
    });

Repo.route('/commit')
    .post((req, res, next) => {
        const gh = new Github(req.session.ghCookie);
        const body = req.body;
        gh.commitNewFile(new Submission(body.id), body.url, body.title, body.slug, body.commit)
            .then((response) => {
                req.session.ghCookie = response.cookie;
                res.status(200).send();
            })
            .catch((err) => {
                res.status(400).send(err);
            })
    });


export default Repo;