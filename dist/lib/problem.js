"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("../utils/helper");
const submission_1 = __importDefault(require("./submission"));
class Problem {
    constructor(slug, id, questionFrontendId, title, difficulty, locked, status, tag, totalAccepted, totalSubmission, sampleTestCase, content, codeSnippets) {
        this.slug = slug;
        this.id = id;
        this.questionFrontendId = questionFrontendId;
        this.title = title;
        this.difficulty = difficulty;
        this.locked = locked;
        this.status = status;
        this.tag = tag;
        this.totalAccepted = totalAccepted;
        this.totalSubmission = totalSubmission;
        this.sampleTestCase = sampleTestCase;
        this.content = content;
        this.codeSnippets = codeSnippets;
    }
    static setUris(uris) {
        Problem.uris = uris;
    }
    detail() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield helper_1.Helper.GraphQlRequest({
                query: `
            query questionDetail($titleSlug: String!){
                question(titleSlug: $titleSlug){
                    questionId
                    questionFrontendId
                    title
                    difficulty
                    status
                    content
                    topicTags{
                        name
                    }
                    stats
                }
            }`,
                variables: {
                    titleSlug: this.slug,
                }
            }).catch(err => {
                throw new Error(err);
            });
            const question = response.question;
            this.id = Number(question.questionId);
            this.questionFrontendId = Number(question.questionFrontendId);
            this.title = question.title;
            this.difficulty = question.difficulty;
            this.status = helper_1.Helper.statusMap(question.status);
            this.tag = question.topicTags.map((tag) => {
                return tag.name;
            });
            const stats = JSON.parse(question.stats);
            this.totalAccepted = stats.totalAcceptedRaw;
            this.totalSubmission = stats.totalSubmissionRaw;
            this.sampleTestCase = question.sampleTestCase;
            this.content = question.content.replace(/<p>&nbsp;<\/p>/g, '');
            return this;
        });
    }
    getSubmission() {
        return __awaiter(this, void 0, void 0, function* () {
            const submissions = [];
            let offset = 0;
            const limit = 20;
            let hasNext = true;
            while (hasNext) {
                const response = yield helper_1.Helper.GraphQlRequest({
                    query: `
                query Submissions($offset: Int!, $limit: Int!, $questionSlug: String!){
                    submissionList(offset: $offset, limit: $limit, questionSlug: $questionSlug){
                        lastKey
                        hasNext
                        submissions {
                            id
                            statusDisplay
                            lang
                            runtime
                            timestamp
                            url
                            memory
                        }
                    }
                }
            `,
                    variables: {
                        questionSlug: this.slug,
                        offset,
                        hasNext,
                        limit
                    }
                });
                hasNext = response.submissionList.hasNext;
                const submission = response.submissionList.submissions;
                offset += submission.length;
                submission.map(sub => {
                    submissions.push(new submission_1.default(Number(sub.id), helper_1.Helper.statusMap(sub.statusDisplay), sub.lang, sub.runtime, sub.timestamp, sub.url, sub.memory, sub.content));
                });
            }
            return submissions;
        });
    }
}
exports.default = Problem;
//# sourceMappingURL=problem.js.map