"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Endpoint = exports.SubmissionStatus = exports.ProblemDifficulty = void 0;
var Endpoint;
(function (Endpoint) {
    Endpoint[Endpoint["US"] = 0] = "US";
    Endpoint[Endpoint["CN"] = 1] = "CN";
})(Endpoint || (Endpoint = {}));
exports.Endpoint = Endpoint;
var ProblemDifficulty;
(function (ProblemDifficulty) {
    ProblemDifficulty[ProblemDifficulty["Easy"] = 0] = "Easy";
    ProblemDifficulty[ProblemDifficulty["Medium"] = 1] = "Medium";
    ProblemDifficulty[ProblemDifficulty["Hard"] = 2] = "Hard";
})(ProblemDifficulty || (ProblemDifficulty = {}));
exports.ProblemDifficulty = ProblemDifficulty;
var SubmissionStatus;
(function (SubmissionStatus) {
    SubmissionStatus[SubmissionStatus["Accepted"] = 0] = "Accepted";
    SubmissionStatus[SubmissionStatus["Compile Error"] = 1] = "Compile Error";
    SubmissionStatus[SubmissionStatus["Wrong answer"] = 2] = "Wrong answer";
    SubmissionStatus[SubmissionStatus["Time Limit Exceeded"] = 3] = "Time Limit Exceeded";
})(SubmissionStatus || (SubmissionStatus = {}));
exports.SubmissionStatus = SubmissionStatus;
//# sourceMappingURL=interfaces.js.map