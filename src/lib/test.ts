import Leetcode from './leetcode';
import { Endpoint, Credit } from '../utils/interfaces';
import { Helper } from '../utils/helper';
import url from '../lib/config';
import { json } from 'express';

const endpoint: Endpoint = Endpoint.US;

const credit: Credit = {
    session: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfYXV0aF91c2VyX2lkIjoiMjM2OTI4MyIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImFsbGF1dGguYWNjb3VudC5hdXRoX2JhY2tlbmRzLkF1dGhlbnRpY2F0aW9uQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6Ijc4ZTk1YjU4ODljYjllYTRmNTM3NjNkNWY5OGM0NjUyMjE0Mzc3YjgiLCJpZCI6MjM2OTI4MywiZW1haWwiOiJtYW5oZHVjZGtjYkBnbWFpbC5jb20iLCJ1c2VybmFtZSI6IkR1a2VNYW5oIiwidXNlcl9zbHVnIjoiRHVrZU1hbmgiLCJhdmF0YXIiOiJodHRwczovL2Fzc2V0cy5sZWV0Y29kZS5jb20vdXNlcnMvZHVrZW1hbmgvYXZhdGFyXzE1ODk4NDE4ODQucG5nIiwicmVmcmVzaGVkX2F0IjoxNjA1NTY4OTI2LCJpcCI6IjIwOS4xNDEuMTk3LjEyMyIsImlkZW50aXR5IjoiIiwic2Vzc2lvbl9pZCI6NDE3OTExNH0.gLKPtOMr64QTzDdiYQMi2V2Obn2q5O9856FEGx99ImI',
    csrfToken: 'u4ZTr1ZmXyKEJBcV5OTcNLP34ljgPu5fcTOfFWLf0JAweyzdRszCNqfmvMcwdqSX'
};

Helper.switchEndPoint(endpoint);
Helper.setCredit(credit);


const leet: Leetcode = new Leetcode(credit);


async function userInfo(): Promise<any> {
    const response: any = await Helper.HttpRequest({
        url: Helper.uris.problemsAll,
        method: 'GET',
        resolveWithFullResponse: true,
        referer: Helper.uris.problemSet
    });

    return JSON.parse(response.body);

}

userInfo()
    .then(res => {
        console.log(res.ac_hard)
    })
    .catch(err => console.log(err));
