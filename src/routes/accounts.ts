import Express from 'express';
import bodyParser from 'body-parser';
import Leetcode from '../lib/leetcode';
import { Endpoint } from '../utils/interfaces';

const Accounts = Express.Router();
Accounts.use(bodyParser.urlencoded({ extended: true }))
Accounts.use(bodyParser.json());



Accounts.route('/login')
    .post((req, res, next) => {
        let endpoint: Endpoint;
        if (req.body.endpoint === 'US') {
            endpoint = Endpoint.US;
        }
        else {
            endpoint = Endpoint.CN;
        }
        Leetcode.build(req.body.username, req.body.password, endpoint)
            .then(async leetcode => {
                const username: string = await leetcode.getProfile();
                res.send(username);
            })
            .catch(err => next(err))
    });

export default Accounts;
