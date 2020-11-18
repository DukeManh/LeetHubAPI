import Express from 'express';
const app = Express();
const port = 8000;

import Accounts from './routes/accounts';

app.get('/', (req, res) => {
    res.send('Leethub.com');
});


app.use('/accounts', Accounts);


app.listen(port, () => {
    // tslint:disable-next-line: no-console
    return console.log("Server listening on port http://localhost:" + port);
})