import { Helper } from '../utils/helper';
import Submission from './submission';
import { ProblemDifficulty, SubmissionStatus, Uris } from '../utils/interfaces';

class Problem {
    static uris: Uris;

    static setUris(uris: Uris): void {
        Problem.uris = uris;
    }

    constructor(
        readonly slug: string,
        public id?: number,
        public title?: string,
        public difficulty?: ProblemDifficulty,
        public locked?: boolean,
        public status?: SubmissionStatus,
        public tag?: string[],
        public totalAccepted?: number,
        public totalSubmission?: number,

        public sampleTestCase?: string,
        public content?: string,
        public codeSnippets?: any[],
    ) { }

    async detail(): Promise<Problem> {
        const response = await Helper.GraphQlRequest({
            query: `
            query questionDetail($titleSlug: String!){
                question(titleSlug: $titleSlug){
                    questionId
                    title
                    difficulty
                    status
                    content
                    topicTags{
                        name
                    }
                    stats
                    codeSnippets {
                        lang
                        langSlug
                        code
                        __typename
                    }
                }
            }`,
            variables: {
                titleSlug: this.slug,
            }
        });

        const question = response.question;
        this.id = Number(question.questionId);
        this.title = question.title;
        this.difficulty = question.difficulty;
        this.status = Helper.statusMap(question.status);
        this.tag = question.topicTags.map((tag: any) => {
            return tag.name;
        });
        const stats: any = JSON.parse(question.stats);
        this.totalAccepted = stats.totalAcceptedRaw;
        this.totalSubmission = stats.totalSubmissionRaw;

        this.sampleTestCase = question.sampleTestCase;
        this.content = question.content.replace(/<p>&nbsp;<\/p>/g, '').replace(/\n\n/g, '\n');
        this.codeSnippets = question.codeSnippets;
        return this;

    }

    async getSubmission(): Promise<Submission[]> {
        const submissions: Submission[] = [];
        let offset = 0;
        const limit = 20;
        let hasNext = true;
        while (hasNext) {
            const response = await Helper.GraphQlRequest({
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
            const submission: any[] = response.submissionList.submissions;
            offset += submission.length;

            submission.map(sub => {
                submissions.push(new Submission(
                    Number(sub.id),
                    Helper.statusMap(sub.statusDisplay),
                    sub.lang,
                    sub.runtime,
                    sub.timestamp,
                    sub.url,
                    sub.memory,
                    sub.content
                ));
            });
        }
        return submissions;
    }
}


export default Problem;