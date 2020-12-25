"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("./helper");
const config_1 = __importDefault(require("../lib/config"));
const graphql_request_1 = require("graphql-request");
const uris = config_1.default.uri.us;
const credit = {
    "session": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfYXV0aF91c2VyX2lkIjoiMjM2OTI4MyIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImFsbGF1dGguYWNjb3VudC5hdXRoX2JhY2tlbmRzLkF1dGhlbnRpY2F0aW9uQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6Ijc4ZTk1YjU4ODljYjllYTRmNTM3NjNkNWY5OGM0NjUyMjE0Mzc3YjgiLCJpZCI6MjM2OTI4MywiZW1haWwiOiJtYW5oZHVjZGtjYkBnbWFpbC5jb20iLCJ1c2VybmFtZSI6IkR1a2VNYW5oIiwidXNlcl9zbHVnIjoiRHVrZU1hbmgiLCJhdmF0YXIiOiJodHRwczovL2Fzc2V0cy5sZWV0Y29kZS5jb20vdXNlcnMvZHVrZW1hbmgvYXZhdGFyXzE1ODk4NDE4ODQucG5nIiwicmVmcmVzaGVkX2F0IjoxNjA4OTExNjQ0LCJpcCI6IjIwOS4xNDEuMTk3LjEyMyIsImlkZW50aXR5IjoiIiwic2Vzc2lvbl9pZCI6NTE5ODk5Nn0.3RcWEu8V-UCzEQ1NRkehEAngyeB2hBSUgzXJcyf2bXg",
    "csrfToken": "fq5mLUuYeuKU4p3kLjdXRLE5ChGbtaFDbcOx2E6eZSCYayP6aUKIggiRhByfd8tz"
};
helper_1.Helper.setUris(uris);
helper_1.Helper.setCredit(credit);
const profile = graphql_request_1.gql `
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
const user = graphql_request_1.gql `
            user{
                username
            }
`;
const global = graphql_request_1.gql `
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
// const slug = 'two-sum';
// const pro: Problem = new Problem(slug);
// pro.detail().then((question) => {
//     console.log(question);
// }).catch((err) => {
//     console.log(err);
// });
// let content = "<p>Given an array <code>arr</code>&nbsp;that represents a permutation of numbers from <code>1</code>&nbsp;to <code>n</code>. You have a binary string of size&nbsp;<code>n</code>&nbsp;that initially has all its bits set to zero.</p>\n\n<p>At each step <code>i</code>&nbsp;(assuming both the binary string and <code>arr</code> are 1-indexed) from <code>1</code> to&nbsp;<code>n</code>, the bit at position&nbsp;<code>arr[i]</code>&nbsp;is set to&nbsp;<code>1</code>. You are given an integer&nbsp;<code>m</code>&nbsp;and you need to find the latest step at which there exists a group of ones of length&nbsp;<code>m</code>. A group of ones is a contiguous substring of 1s such that it cannot be extended in either direction.</p>\n\n<p>Return <em>the latest step at which there exists a group of ones of length <strong>exactly</strong></em>&nbsp;<code>m</code>. <em>If no such group exists, return</em>&nbsp;<code>-1</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong>Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> arr = [3,5,1,2,4], m = 1\n<strong>Output:</strong> 4\n<strong>Explanation:\n</strong>Step 1: &quot;00<u>1</u>00&quot;, groups: [&quot;1&quot;]\nStep 2: &quot;0010<u>1</u>&quot;, groups: [&quot;1&quot;, &quot;1&quot;]\nStep 3: &quot;<u>1</u>0101&quot;, groups: [&quot;1&quot;, &quot;1&quot;, &quot;1&quot;]\nStep 4: &quot;1<u>1</u>101&quot;, groups: [&quot;111&quot;, &quot;1&quot;]\nStep 5: &quot;111<u>1</u>1&quot;, groups: [&quot;11111&quot;]\nThe latest step at which there exists a group of size 1 is step 4.</pre>\n\n<p><strong>Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> arr = [3,1,5,4,2], m = 2\n<strong>Output:</strong> -1\n<strong>Explanation:\n</strong>Step 1: &quot;00<u>1</u>00&quot;, groups: [&quot;1&quot;]\nStep 2: &quot;<u>1</u>0100&quot;, groups: [&quot;1&quot;, &quot;1&quot;]\nStep 3: &quot;1010<u>1</u>&quot;, groups: [&quot;1&quot;, &quot;1&quot;, &quot;1&quot;]\nStep 4: &quot;101<u>1</u>1&quot;, groups: [&quot;1&quot;, &quot;111&quot;]\nStep 5: &quot;1<u>1</u>111&quot;, groups: [&quot;11111&quot;]\nNo group of size 2 exists during any step.\n</pre>\n\n<p><strong>Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> arr = [1], m = 1\n<strong>Output:</strong> 1\n</pre>\n\n<p><strong>Example 4:</strong></p>\n\n<pre>\n<strong>Input:</strong> arr = [2,1], m = 2\n<strong>Output:</strong> 2\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>n == arr.length</code></li>\n\t<li><code>1 &lt;= n &lt;= 10^5</code></li>\n\t<li><code>1 &lt;= arr[i] &lt;= n</code></li>\n\t<li>All integers in&nbsp;<code>arr</code>&nbsp;are&nbsp;<strong>distinct</strong>.</li>\n\t<li><code>1 &lt;= m&nbsp;&lt;= arr.length</code></li>\n</ul>\n";
// content = content.replace(/\n/gm, '');
// console.log(content);
//# sourceMappingURL=test.js.map