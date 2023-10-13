import { Router } from 'express';

import { authRouter } from './auth';
import { petsRouter } from './pets';

export const globalRouter = Router();

globalRouter.use('/accounts', authRouter);
globalRouter.use('/pets', petsRouter);