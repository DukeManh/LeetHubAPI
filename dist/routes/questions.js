"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const problem_1 = __importDefault(require("../lib/problem"));
const service_1 = require("../utils/service");
const Questions = express_1.default.Router();
Questions.use(body_parser_1.default.urlencoded({ extended: true }));
Questions.use(body_parser_1.default.json());
Questions.route('/')
    .get((req, res, next) => {
    service_1.fetchQuestions()
        .then(subs => {
        subs.stat_status_pairs = subs.stat_status_pairs.filter(ssp => ssp.status);
        res.status(200).json(subs);
    })
        .catch(err => res.status(400).send(err.message));
});
Questions.route('/:slug')
    .get((req, res) => {
    const problem = new problem_1.default(req.params.slug);
    problem.detail()
        .then((prob) => {
        res.status(200).json(prob);
    }).catch((err) => {
        res.status(404).send(err.message);
    });
});
exports.default = Questions;
//# sourceMappingURL=questions.js.map