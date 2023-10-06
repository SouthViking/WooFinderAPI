import { registrationHandler } from '../controllers/auth/register';

import { Router } from 'express';

export const authRouter = Router();

authRouter.post('/accounts', registrationHandler);