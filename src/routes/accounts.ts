import Express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import Leetcode from '../lib/leetcode';
import { login, logout, build } from '../utils/service';
import { Helper } from '../utils/helper';

const Accounts = Express.Router();

Accounts.use(bodyParser.urlencoded({ extended: true }))
Accounts.use(bodyParser.json());
Accounts.use(cookieParser());

var leetcode: Leetcode;

Accounts.route('/')
    .get((req, res, next) => {
        let cookie = req.cookies;
        if (cookie.csrftoken && cookie.session) {
            build(
                {
                    session: cookie.session,
                    csrfToken: cookie.csrftoken
                },
                cookie.endpoint)
                .then(user => {
                    res.status(200).json(user);
                })
                .catch(err => res.status(401).send());
        }
        else {
            res.status(401).send();
        }
    })

Accounts.route('/login')
    .post((req, res, next) => {
        login(req.body)
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
        logout();
        res.clearCookie('LeetcodeCookie');
        res.status(200).send();
    })

export default Accounts;
