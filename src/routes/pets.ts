import { Router } from 'express';

import { petRegistrationHandler } from '../controllers/pets/registration';
import { accessTokenVerification } from '../middlewares/auth';
import { petUpdateHandler } from '../controllers/pets/update';
import { reportCreationHandler } from '../controllers/reports/creation';

export const petsRouter = Router();

petsRouter.post('/', accessTokenVerification, petRegistrationHandler);
petsRouter.put('/:id', accessTokenVerification, petUpdateHandler);
petsRouter.post('/:id/reports', accessTokenVerification, reportCreationHandler);