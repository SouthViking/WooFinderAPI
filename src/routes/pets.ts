import { Router } from 'express';

import { petRegistrationHandler } from '../controllers/pets/registration';
import { accessTokenVerification } from '../middlewares/auth';
import { petUpdateHandler } from '../controllers/pets/update';

export const petsRouter = Router();

petsRouter.post('/', accessTokenVerification, petRegistrationHandler);
petsRouter.put('/:id', accessTokenVerification, petUpdateHandler);