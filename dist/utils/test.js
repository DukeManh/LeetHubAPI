"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("./helper");
const config_1 = __importDefault(require("../lib/config"));
const graphql_request_1 = require("graphql-request");
let uris = config_1.default.uri.us;
let credit = {
    "session": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfYXV0aF91c2VyX2lkIjoiMjM2OTI4MyIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImFsbGF1dGguYWNjb3VudC5hdXRoX2JhY2tlbmRzLkF1dGhlbnRpY2F0aW9uQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6Ijc4ZTk1YjU4ODljYjllYTRmNTM3NjNkNWY5OGM0NjUyMjE0Mzc3YjgiLCJpZCI6MjM2OTI4MywiZW1haWwiOiJtYW5oZHVjZGtjYkBnbWFpbC5jb20iLCJ1c2VybmFtZSI6IkR1a2VNYW5oIiwidXNlcl9zbHVnIjoiRHVrZU1hbmgiLCJhdmF0YXIiOiJodHRwczovL2Fzc2V0cy5sZWV0Y29kZS5jb20vdXNlcnMvZHVrZW1hbmgvYXZhdGFyXzE1ODk4NDE4ODQucG5nIiwicmVmcmVzaGVkX2F0IjoxNjA4MTY0NDg2LCJpcCI6IjIwOS4xNDEuMTk3LjEyMyIsImlkZW50aXR5IjoiIiwic2Vzc2lvbl9pZCI6NTAxMzQwNX0.8ollYwIOO9JR_z6z1NT2m20dCS2OvUnPTUXmJS2DUiM",
    "csrfToken": "IUtSbXuyOi030X4aHRdsbBU29dGBeJ9sGVsKbmOzUWSo6MGYuRd0EOQsudpRnK0u"
};
helper_1.Helper.setUris(uris);
helper_1.Helper.setCredit(credit);
let profile = graphql_request_1.gql `
            query getUserProfile($username: String!) {
                matchedUser(username: $username) {
                    username
                    githubUrl 
                    profile {
                        realName
                        websites
                        countryName
                        skillTags
                        company
                        school
                        starRating
                        aboutMe
                        userAvatar
                        reputation
                        ranking
                        __typename
                    }
                    submitStats {
                        acSubmissionNum {
                            difficulty
                            count
                            submissions
                            __typename
                        }
                        totalSubmissionNum {
                            difficulty
                            count
                            submissions
                            __typename
                        }
                        __typename
                    }
                }
            }
    `;
let user = graphql_request_1.gql `
            user{
                username
            }
`;
let global = graphql_request_1.gql `
query globalData {
    userCountryCode
    userStatus {
        isPremium
        username
        realName
        avatar
        requestRegion
    }
}
`;
helper_1.Helper.GraphQlRequest({
    query: global,
    variables: {
        username: 'DukeManh'
    }
}).then((res) => {
    console.log(res);
})
    .catch(err => console.log(err));
//# sourceMappingURL=test.js.map