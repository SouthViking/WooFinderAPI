import { Router } from 'express';

import { petRegistrationHandler } from '../controllers/pets/registration';
import { accessTokenVerification } from '../middlewares/auth';
import { petUpdateHandler } from '../controllers/pets/update';
import { reportCreationHandler } from '../controllers/reports/creation';
import { deleteReportHandler } from '../controllers/reports/deletion';
import { petDetailHandler } from '../controllers/pets/detail';
import { petDeletionHandler } from '../controllers/pets/deletion';
import { reportDetailHandler } from '../controllers/reports/detail';

export const petsRouter = Router();

petsRouter.post('/', accessTokenVerification, petRegistrationHandler);
petsRouter.put('/:id', accessTokenVerification, petUpdateHandler);
petsRouter.get('/:id', accessTokenVerification, petDetailHandler);
petsRouter.delete('/:id', accessTokenVerification, petDeletionHandler);
petsRouter.post('/:id/reports', accessTokenVerification, reportCreationHandler);
petsRouter.get('/:id/reports/:reportId', accessTokenVerification, reportDetailHandler);
petsRouter.delete('/:id/reports/:reportId', accessTokenVerification, deleteReportHandler);