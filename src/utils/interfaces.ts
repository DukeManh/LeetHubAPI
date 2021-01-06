interface HttpRequestOptions {
    method: string;
    url: string;
    referer?: string;
    resolveWithFullResponse?: boolean;
    followAllRedirects?: boolean;
    followRedirect?: any;
    maxRedirects?: number;
    form?: any;
    body?: any;
    cookie?: string;
    extra?: {
        accept?: string;
        'user-agent'?: string;
        'cache-control'?: string;
        'accept-language'?: string;
        commit?: string;
        authenticity_token?: string;
    }
}

interface GraphQLOptions {
    origin?: string;
    referer?: string;
    query: string;
    variables?: object;
}

interface Uris {
    base: string;
    login: string;
    graphql: string;
    problemsAll: string;
    problem: string;
    problemSet: string;
    submission: string;
}

interface Credit {
    session?: string;
    csrfToken: string;
    githubCookie?: string;
}

enum Endpoint {
    'US',
    'CN'
}

enum ProblemDifficulty {
    'Easy',
    'Medium',
    'Hard',
}

enum SubmissionStatus {
    'Accepted',
    'Compile Error',
    'Wrong answer',
    'Time Limit Exceeded',
}




export { HttpRequestOptions, Uris, Credit, ProblemDifficulty, SubmissionStatus, GraphQLOptions, Endpoint };