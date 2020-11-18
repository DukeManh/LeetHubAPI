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
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const leetcode_1 = __importDefault(require("../lib/leetcode"));
const interfaces_1 = require("../utils/interfaces");
const Accounts = express_1.default.Router();
Accounts.use(body_parser_1.default.urlencoded({ extended: true }));
Accounts.use(body_parser_1.default.json());
Accounts.route('/login')
    .post((req, res, next) => {
    console.log(req.body);
    let endpoint;
    if (req.body.endpoint === 'US') {
        endpoint = interfaces_1.Endpoint.US;
    }
    else {
        endpoint = interfaces_1.Endpoint.CN;
    }
    leetcode_1.default.build(req.body.username, req.body.password, endpoint)
        .then((leetcode) => __awaiter(void 0, void 0, void 0, function* () {
        const username = yield leetcode.getProfile();
        res.send(username);
    }))
        .catch(err => next(err));
});
exports.default = Accounts;
//# sourceMappingURL=accounts.js.map