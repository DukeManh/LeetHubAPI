"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const service_1 = require("../utils/service");
const Submissions = express_1.default.Router();
Submissions.use(body_parser_1.default.urlencoded({ extended: true }));
Submissions.use(body_parser_1.default.json());
Submissions.route('/')
    .get((req, res) => {
    service_1.fetchSubs()
        .then(subs => {
        subs.stat_status_pairs = subs.stat_status_pairs.filter(ssp => ssp.status === "ac");
        res.status(200).json(subs);
    })
        .catch(err => res.status(500).send(err));
});
Submissions.route('/:question_id')
    .get((req, res) => {
    const question_id = Number(req.params.question_id);
});
exports.default = Submissions;
//# sourceMappingURL=submissions.js.map