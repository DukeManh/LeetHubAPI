import Express from 'express';
import bodyParser from 'body-parser';
import Problem from '../lib/problem';
import { fetchQuestions } from '../utils/service';


const Questions = Express.Router();


Questions.use(bodyParser.urlencoded({ extended: true }))
Questions.use(bodyParser.json());


Questions.route('/')
    .get((req, res, next) => {
        fetchQuestions()
            .then(subs => {
                subs.stat_status_pairs = subs.stat_status_pairs.filter(ssp => ssp.status)
                res.status(200).json(subs);
            })
            .catch(err => res.status(400).send(err));
    });


Questions.route('/:slug')
    .get((req, res) => {
        const problem: Problem = new Problem(req.params.slug);
        problem.detail()
            .then((prob) => {
                res.status(200).json(prob);
            }).catch((err) => {
                res.status(404).send(err);
            });
    });

export default Questions;