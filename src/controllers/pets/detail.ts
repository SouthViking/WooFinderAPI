import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { DBCollections, PetDocument, ReportDocument, storage } from '../../db';

export const petDetailHandler = async (request: Request<{ id: string; }>, response: Response) => {
    const { id: petId } = request.params;

    if (!ObjectId.isValid(petId)) {
        return response.status(StatusCodes.BAD_REQUEST).json({
            message: 'The pet ID is not valid.',
        });
    }

    const petStorageId = new ObjectId(petId);

    const petRecord = await storage.findOne<PetDocument>(DBCollections.PETS, { _id: petStorageId });
    if (!petRecord) {
        return response.status(StatusCodes.NOT_FOUND).json({
            message: 'The pet does not exist.',
        });
    }

    petRecord.reports = [];
    const petReports = await storage.find<ReportDocument>(DBCollections.REPORTS, { petId: petStorageId }, { projection: { _id: 1 } });
    for await (const petReport of petReports) {
        petRecord.reports.push(petReport._id.toString());
    }

    return response.status(StatusCodes.OK).json(petRecord);
};