import { loginHandler } from '../controllers/auth/login';
import { registrationHandler } from '../controllers/auth/register';
import { accountVerificationHandler } from '../controllers/auth/account-verification';

import { Router } from 'express';

export const authRouter = Router();

authRouter.post('/login', loginHandler);
authRouter.post('/', registrationHandler);
authRouter.post('/verify', accountVerificationHandler);