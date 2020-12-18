import Express from 'express';
import bodyParser from 'body-parser';
import Submission from '../lib/submission';
import { fetchSubs, getSubList } from '../utils/service';


const Submissions = Express.Router();
Submissions.use(bodyParser.urlencoded({ extended: true }))
Submissions.use(bodyParser.json());


Submissions.route('/')
    .get((req, res) => {
        fetchSubs()
            .then(subs => {
                subs.stat_status_pairs = subs.stat_status_pairs.filter(ssp => ssp.status)
                res.status(200).json(subs);
            })
            .catch(err => res.status(400).send(err));
    });


Submissions.route('/:question_id')
    .get((req, res) => {
        const question_id: number = Number(req.params.question_id);
    });


export default Submissions;