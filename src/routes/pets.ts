import { Router } from 'express';

import { petRegistrationHandler } from '../controllers/pets/registration';
import { accessTokenVerification } from '../middlewares/auth';

export const petsRouter = Router();

petsRouter.post('/', accessTokenVerification, petRegistrationHandler);