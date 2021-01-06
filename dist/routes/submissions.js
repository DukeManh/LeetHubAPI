"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const submission_1 = __importDefault(require("../lib/submission"));
const problem_1 = __importDefault(require("../lib/problem"));
const Submissions = express_1.default.Router();
Submissions.use(body_parser_1.default.urlencoded({ extended: true }));
Submissions.use(body_parser_1.default.json());
Submissions.route('/:question_slug')
    .get((req, res) => {
    const problem = new problem_1.default(req.params.question_slug);
    problem.getSubmission().then((submissions) => {
        res.status(200).send(submissions);
    }).catch((err) => {
        res.status(404).send(err);
    });
});
Submissions.route('/detail/:id')
    .get((req, res) => {
    const submission = new submission_1.default(Number(req.params.id));
    submission.detail().then((sub) => {
        res.status(200).json(sub);
    }).catch((err) => {
        res.status(400).send(err);
    });
});
exports.default = Submissions;
//# sourceMappingURL=submissions.js.map