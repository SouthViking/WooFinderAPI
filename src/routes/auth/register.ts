import { registrationHandler } from '../../controllers/auth/register';

import { Router } from 'express';

const authRouter = Router();

authRouter.post('/accounts', registrationHandler);

export default authRouter;