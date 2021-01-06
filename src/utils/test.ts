import { Helper } from './helper';
import config from '../lib/config';
import { Uris, Credit } from './interfaces';
import { gql } from 'graphql-request';
import Problem from '../lib/problem';
import cheerio from 'cheerio'

const uris: Uris = config.uri.us;
const credit: Credit = {
    "session": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfYXV0aF91c2VyX2lkIjoiMjM2OTI4MyIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImFsbGF1dGguYWNjb3VudC5hdXRoX2JhY2tlbmRzLkF1dGhlbnRpY2F0aW9uQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6Ijc4ZTk1YjU4ODljYjllYTRmNTM3NjNkNWY5OGM0NjUyMjE0Mzc3YjgiLCJpZCI6MjM2OTI4MywiZW1haWwiOiJtYW5oZHVjZGtjYkBnbWFpbC5jb20iLCJ1c2VybmFtZSI6IkR1a2VNYW5oIiwidXNlcl9zbHVnIjoiRHVrZU1hbmgiLCJhdmF0YXIiOiJodHRwczovL2Fzc2V0cy5sZWV0Y29kZS5jb20vdXNlcnMvZHVrZW1hbmgvYXZhdGFyXzE1ODk4NDE4ODQucG5nIiwicmVmcmVzaGVkX2F0IjoxNjA4OTExNjQ0LCJpcCI6IjIwOS4xNDEuMTk3LjEyMyIsImlkZW50aXR5IjoiIiwic2Vzc2lvbl9pZCI6NTE5ODk5Nn0.3RcWEu8V-UCzEQ1NRkehEAngyeB2hBSUgzXJcyf2bXg",
    "csrfToken": "fq5mLUuYeuKU4p3kLjdXRLE5ChGbtaFDbcOx2E6eZSCYayP6aUKIggiRhByfd8tz"
}


Helper.setUris(uris);
Helper.setCredit(credit);

const profile = gql`
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
const user = gql`
            user{
                username
            }
`;

const global = gql`
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
`

// Helper.GraphQlRequest({
//     query: global,
//     variables: {
//         username: 'DukeManh'
//     }
// }).then((res) => {
//     console.log(res);
// })
//     .catch(err => console.log(err));


// const slug = 'two-sum';

// const pro: Problem = new Problem(slug);

// pro.detail().then((question) => {
//     console.log(question);
// }).catch((err) => {
//     console.log(err);
// });

const content = "<div></div>";

const $ = cheerio.load(content);
