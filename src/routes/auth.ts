import { registrationHandler } from '../controllers/auth/register';
import { accountVerificationHandler } from '../controllers/auth/account-verification';

import { Router } from 'express';

export const authRouter = Router();

authRouter.post('/accounts', registrationHandler);
authRouter.post('/accounts/verify', accountVerificationHandler);