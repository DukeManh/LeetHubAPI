import Express from 'express';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import { login, logout, build } from '../utils/service';
const Accounts = Express.Router();


Accounts.use(bodyParser.urlencoded({ extended: true }))
Accounts.use(bodyParser.json());



Accounts.route('/')
    .get((req, res, next) => {
        const session = req.session;
        if (session.csrfToken && session.session) {
            build({
                session: session.session,
                csrfToken: session.csrfToken,
                githubCookie: session.ghCookie
            }, session.endpoint)
                .then(user => {
                    res.status(200).json(user);
                })
                .catch(err => {
                    res.status(401).send(err.message)
                });
        }
        else {
            res.status(401).send('Authorization failed');
        }
    })

Accounts.route('/login')
    .post((req, res, next) => {
        login(req.body)
            .then(user => {
                const session: any = {
                    csrfToken: user.credit.csrfToken,
                    session: user.credit.session,
                    ghCookie: user.credit.githubCookie,
                    username: user.userStatus.username,
                    endpoint: user.userStatus.requestRegion,
                }
                req.session = session;
                res.status(200).json(user);
            })
            .catch(err => {
                res.status(401).send(err.message)
            });
    });

Accounts.route('/logout')
    .get((req, res, next) => {
        logout();
        req.session = null;
        res.end();
    })

export default Accounts;
