import Express from 'express';
import bodyParser from 'body-parser';
import Submission from '../lib/submission';
import Problem from '../lib/problem';


const Submissions = Express.Router();
Submissions.use(bodyParser.urlencoded({ extended: true }))
Submissions.use(bodyParser.json());


Submissions.route('/:question_slug')
    .get((req, res) => {
        const problem: Problem = new Problem(req.params.question_slug);
        problem.getSubmission().then((submissions) => {
            res.status(200).send(submissions);
        }).catch((err) => {
            res.status(404).send(err);
        });
    });

Submissions.route('/detail/:id')
    .get((req, res) => {
        const submission: Submission = new Submission(Number(req.params.id));
        submission.detail().then((sub) => {
            res.status(200).json(sub);
        }).catch((err) => {
            res.status(400).send('submission not found');
        });
    })

export default Submissions;