import Express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import Accounts from './routes/accounts';
import Submissions from './routes/submissions';
import Questions from './routes/questions';
import { Helper } from './utils/helper';
import { build } from './utils/service';

const app = Express();
const port = 8080;

const whitelist = ['http://localhost:3000', '*'];
app.disable('etag');
const corsOptions = {
    origin(origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            console.log(origin);
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true
}
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

app.use(morgan('tiny'));
app.use(cookieParser());
app.use(cookieSession({
    name: 'session',
    secret: 'alsafj39jsdfj309fjsdffjlfsdjfoseiru03',
    secure: false,
    expires: new Date(Date.now() + 72 * 60 * 60 * 1000),
}));

app.use((req, res, next) => {
    req.session.nowInMinutes = Math.floor(Date.now() / 60e3)
    next()
})

function authorize(req: any, res: any, next: any) {
    const session: any = req.session;
    if (!session.csrftoken && !session.session) {
        req.session = null;
        res.status(401).send('Authorization failed')
    }
    else {
        if (!Helper.credit) {
            build(
                {
                    session: session.session,
                    csrfToken: session.csrftoken
                },
                session.endpoint)
                .then(user => {
                    next();
                })
                .catch(err => {
                    req.session = null;
                    res.status(401).send(err)
                }
                );
        }
        else {
            next();
        }
    }
}

app.use('/accounts', Accounts);
app.use('/submissions', authorize, Submissions);
app.use('/questions', authorize, Questions);

app.all('*', (req, res, next) => {
    res.status(404).send('Page Not Found');
})


app.listen(port, () => {
    // tslint:disable-next-line: no-console
    return console.log('Server listening on port http://localhost:' + port);
})
