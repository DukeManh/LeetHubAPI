import Leetcode from './leetcode';
import { Endpoint } from '../utils/interfaces';

const endpoint: Endpoint = Endpoint.CN;

Leetcode.build("mysecondhandemail@gmail.com", "LifeIsT0ugh", endpoint)
    .then(leet => {
        // tslint:disable-next-line: no-console
        console.log(leet.Credit)
    })
    // tslint:disable-next-line: no-console
    .catch(err => console.log(err));