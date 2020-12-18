"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const accounts_1 = __importDefault(require("./routes/accounts"));
const submissions_1 = __importDefault(require("./routes/submissions"));
const app = express_1.default();
const port = 8080;
var whitelist = ['http://localhost:3000'];
var corsOptions = {
    origin: function (origin, callback) {
        console.log(origin);
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
};
app.options('*', cors_1.default(corsOptions));
app.use(cors_1.default(corsOptions));
app.use(morgan_1.default('tiny'));
app.use(cookie_parser_1.default());
function authorize(req, res, next) {
    const cookie = req.cookies;
    if (!cookie.csrftoken && !cookie.session) {
        res.redirect('/');
    }
    else {
        next();
    }
}
app.use('/accounts', accounts_1.default);
app.use('/submissions', authorize, submissions_1.default);
app.all('*', (req, res, next) => {
    res.status(404).send('Page Not Found');
});
app.listen(port, () => {
    // tslint:disable-next-line: no-console
    return console.log("Server listening on port http://localhost:" + port);
});
//# sourceMappingURL=app.js.map