"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const helper_1 = require("./utils/helper");
const service_1 = require("./utils/service");
const accounts_1 = __importDefault(require("./routes/accounts"));
const submissions_1 = __importDefault(require("./routes/submissions"));
const questions_1 = __importDefault(require("./routes/questions"));
const repos_1 = __importDefault(require("./routes/repos"));
const app = express_1.default();
const port = 8080;
const whitelist = ['http://localhost:3000', '*'];
app.disable('etag');
const corsOptions = {
    origin(origin, callback) {
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
app.use(cookie_session_1.default({
    name: 'session',
    secret: 'alsafj39jsdfj309fjsdffjlfsdjfoseiru03',
    secure: false,
    maxAge: 1000 * 60 * 60 * 72,
    sameSite: 'lax'
}));
app.use((req, res, next) => {
    req.session.nowInMinutes = Math.floor(Date.now() / 60e3);
    next();
});
function authorize(req, res, next) {
    const session = req.session;
    if (!session.csrfToken && !session.session) {
        res.status(401).send('Authorization failed');
    }
    else {
        if (!helper_1.Helper.credit) {
            service_1.build({
                session: session.session,
                csrfToken: session.csrfToken
            }, session.endpoint)
                .then(user => {
                next();
            })
                .catch(err => {
                res.status(401).send(err);
            });
        }
        else {
            next();
        }
    }
}
app.use('/accounts', accounts_1.default);
app.use('/submissions', authorize, submissions_1.default);
app.use('/questions', authorize, questions_1.default);
app.use('/github', authorize, repos_1.default);
app.all('*', (req, res, next) => {
    res.status(404).send('Page Not Found');
});
app.listen(port, () => {
    // tslint:disable-next-line: no-console
    return console.log('Server listening on port http://localhost:' + port);
});
//# sourceMappingURL=app.js.map