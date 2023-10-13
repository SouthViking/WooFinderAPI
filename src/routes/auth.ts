import { Router } from 'express';

import { loginHandler } from '../controllers/auth/login';
import { accessTokenVerification } from '../middlewares/auth';
import { registrationHandler } from '../controllers/auth/register';
import { getAccountHandler } from '../controllers/auth/get_account';
import { accountVerificationHandler } from '../controllers/auth/account-verification';

export const authRouter = Router();

authRouter.post('/login', loginHandler);
authRouter.post('/', registrationHandler);
authRouter.post('/verify', accountVerificationHandler);
authRouter.get('/:id', accessTokenVerification, getAccountHandler);