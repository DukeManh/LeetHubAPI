import Express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import Accounts from './routes/accounts';
import Submissions from './routes/submissions';

const app = Express();
const port = 8080;

var whitelist = ['http://localhost:3000'];
var corsOptions = {
    origin: function (origin, callback) {
        console.log(origin);
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true
}
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

app.use(morgan('tiny'));
app.use(cookieParser());

function authorize(req: any, res: any, next: any) {
    const cookie: any = req.cookies;
    if (!cookie.csrftoken && !cookie.session) {
        res.redirect('/');
    }
    else {
        next();
    }
}

app.use('/accounts', Accounts);
app.use('/submissions', authorize, Submissions);

app.all('*', (req, res, next) => {
    res.status(404).send('Page Not Found');
})


app.listen(port, () => {
    // tslint:disable-next-line: no-console
    return console.log("Server listening on port http://localhost:" + port);
})