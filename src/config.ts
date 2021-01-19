import env from 'dotenv';
const result = env.config();
if (result.error) {
    throw result.error;
}

const port = process.env.PORT;
const environment = process.env.NODE_ENV;
const secret = process.env.SECRET;

export { port, environment, secret };


