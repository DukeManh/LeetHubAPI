import express from 'express';

const app = express();
const port = 8000;
app.get('/', (req, res) => {
    res.send('Leethub.com');
});

app.listen(port, () => {
    return console.log("Server listening on port http://localhost:" + port);
})