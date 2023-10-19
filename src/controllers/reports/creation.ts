import { ObjectId, WithId } from 'mongodb';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { TokenDataLocal } from '../../types';
import { areValidCoordinates } from '../../utils';
import { ReportCreationBody } from '../../types/requests/reports';
import { DBCollections, PetDocument, ReportDocument, storage } from '../../db';


export const reportCreationHandler = async (request: Request<{ id: string; }, any, ReportCreationBody>, response: Response<any, TokenDataLocal>) => {
    const { id: petId } = request.params;
    const { userId } = response.locals.tokenData;
    const { coordinates, details } = request.body;

    if (!ObjectId.isValid(petId)) {
        return response.status(StatusCodes.BAD_REQUEST).json({
            message: 'The provided pet ID has a wrong format.',
        });
    }

    const petStorageId = new ObjectId(petId);

    const petRecord = await storage.findOne<WithId<PetDocument>>(DBCollections.PETS, { _id: petStorageId });
    if (!petRecord) {
        return response.status(StatusCodes.NOT_FOUND).json({
            message: `Pet with id ${petId} does not exist.`,
        });
    }

    if (petRecord.owner.toString() !== userId) {
        return response.status(StatusCodes.FORBIDDEN).json({
            message: 'You are not allowed to add lost reports to the current pet.',
        });
    }

    const currentActiveReport = await storage.findOne<ReportDocument>(DBCollections.REPORTS, { isActive: true, petId: petStorageId });
    if (currentActiveReport) {
        return response.status(StatusCodes.CONFLICT).json({
            message: 'The pet already has an active lost report.',
        });
    }
    
    // TODO: Ugly code... Modify this to be checked by mongoose in a more clever way. 
    if (coordinates === null || !Array.isArray(coordinates) || coordinates.length !== 2 ||
        typeof coordinates[0] !== 'number' || typeof coordinates[1] !== 'number' || !areValidCoordinates(coordinates[0], coordinates[1])
    ) {
        return response.status(StatusCodes.BAD_REQUEST).json({
            message: 'The provided coordinates don\'t have a correct format.',
        });
    }

    const newReportResult = await storage.insertOne<ReportDocument>(DBCollections.REPORTS, {
        petId: petRecord._id,
        lastSeen: {type: 'Point', coordinates },
        isActive: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        ...(details ? { details } : {}),
    });

    return response.status(StatusCodes.CREATED).json({
        id: newReportResult.insertedId.toString(),
    });
};