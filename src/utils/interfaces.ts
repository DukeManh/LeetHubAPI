interface HttpRequestOptions {
    method: string;
    url: string;
    referer?: string;
    resolveWithFullResponse?: boolean; // get full response instead of just the body
    form?: any;
    body?: any;
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
    submission: string;
}

interface Credit {
    session?: string;
    csrfToken: string;
}

enum Endpoint {
    'US',
    'CN'
}

enum ProblemDifficulty {
    "Easy",
    "Medium",
    "Hard",
}

enum SubmissionStatus {
    "Accepted",
    "Compile Error",
    "Wrong answer",
    "Time Limit Exceeded",
}




export { HttpRequestOptions, Uris, Credit, ProblemDifficulty, SubmissionStatus, GraphQLOptions, Endpoint };