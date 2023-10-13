import { Router } from 'express';
import { authRouter } from './auth';

export const globalRouter = Router();

globalRouter.use('/accounts', authRouter);