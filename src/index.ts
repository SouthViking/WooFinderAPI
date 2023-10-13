import path from 'path';

import express from 'express';
import * as dotenv from 'dotenv';
import * as bodyParser from 'body-parser';

import { globalRouter } from './routes';
import { bodyCamelizer } from './middlewares';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const PORT = parseInt(process.env.PORT ?? '8080');

const app = express();

app.use(bodyParser.json());
app.use(bodyCamelizer);

app.use('/api/v1', globalRouter);

app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});