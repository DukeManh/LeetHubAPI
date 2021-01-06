import { Uris, SubmissionStatus } from '../utils/interfaces';
import { Helper } from '../utils/helper';

class Submission {

    static uris: Uris;
    static setUris(uris: Uris): void {
        Submission.uris = uris;
    }

    constructor(
        public id: number,
        public status?: SubmissionStatus,
        public lang?: string,
        public runtime?: string,
        public timestamps?: string,
        public url?: string,
        public memory?: string,
        public code?: string,
    ) { }

    async detail(): Promise<Submission> {
        try {
            const response = await Helper.HttpRequest({
                url: Helper.uris.submission.replace('$id', this.id.toString()),
                method: 'GET',
                resolveWithFullResponse: false
            });
            this.lang = response.match(/getLangDisplay:\s'([^']*)'/)[1];
            this.memory = response.match(/memory:\s'[^']*'/)[1];
            this.runtime = response.match(/runtime:\s'([^']*)'/)[1];
            this.status = Helper.statusMap(response.match(/parseInt\('(\d+)', 10/)[1]);
            this.code = response.match(/submissionCode:\s'([^']*)'/)[1];
            this.code = JSON.parse('"' + this.code + '"');
            return this;
        }
        catch (err) {
            throw new Error(err);
        }
    }
}

export default Submission;