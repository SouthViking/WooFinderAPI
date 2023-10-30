import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { TokenDataLocal } from '../../types';
import { DBCollections, PetDocument, ReportDocument, storage } from '../../db';

export const petDeletionHandler = async (request: Request<{ id: string }>, response: Response<any, TokenDataLocal>) => {
    const { id: petId } = request.params;
    const { userId } = response.locals.tokenData;

    if (!ObjectId.isValid(petId)) {
        return response.status(StatusCodes.BAD_REQUEST).json({
            message: 'The pet ID is not valid.',
        });
    }

    const petStorageId = new ObjectId(petId);

    const petRecord = await storage.findOne<PetDocument>(DBCollections.PETS, { _id: petStorageId });
    if (!petRecord) {
        return response.status(StatusCodes.NOT_FOUND).json({
            message: 'Pet not found.',
        });
    }

    if (petRecord.owner.toString() !== userId) {
        return response.status(StatusCodes.FORBIDDEN).json({
            message: 'Only the owner of the pet can delete the record.',
        });
    }

    await storage.withTransaction(async (session) => {
        await storage.deleteOne<PetDocument>(DBCollections.PETS, { _id: petStorageId }, { session });
        await storage.deleteMany<ReportDocument>(DBCollections.REPORTS, { petId: petStorageId }, { session });
    });

    return response.status(StatusCodes.OK).json({
        message: 'The pet and reports have been removed.',
    });
};