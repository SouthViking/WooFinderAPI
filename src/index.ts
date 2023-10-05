import path from 'path';

import authRouter from './routes/auth/register';
import { bodyCamelizer } from './middlewares';

import express from 'express';
import * as dotenv from 'dotenv';
import * as bodyParser from 'body-parser';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const PORT = parseInt(process.env.PORT ?? '8080');

const app = express();

app.use(bodyParser.json());
app.use(bodyCamelizer);
app.use('/api/v1/', authRouter);

app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});