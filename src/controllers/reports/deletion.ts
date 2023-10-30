import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { TokenDataLocal } from '../../types';
import { DBCollections, PetDocument, ReportDocument, storage } from '../../db';

export const deleteReportHandler = async (request: Request<{ id: string; reportId: string; }>, response: Response<any, TokenDataLocal>) => {
    const { id: petId, reportId } = request.params;
    const { userId } = response.locals.tokenData;

    if (!ObjectId.isValid(petId) || !ObjectId.isValid(reportId)) {
        return response.status(StatusCodes.BAD_REQUEST).json({
            message: 'Either the pet or report ID have wrong format.'
        });
    }

    const petStorageId = new ObjectId(petId);
    const reportStorageId = new ObjectId(reportId);

    const petRecord = await storage.findOne<PetDocument>(DBCollections.PETS, { _id: petStorageId });
    if (!petRecord) {
        return response.status(StatusCodes.NOT_FOUND).json({
            message: `Pet not found for ID ${petId}`,
        });
    }

    if (petRecord.owner.toString() !== userId) {
        return response.status(StatusCodes.FORBIDDEN).json({
            message: 'Reports can only be deleted by the owner.',
        });
    }

    const reportRecord = await storage.findOne<ReportDocument>(DBCollections.REPORTS, { petId: petStorageId, _id: reportStorageId });
    if (!reportRecord) {
        return response.status(StatusCodes.NOT_FOUND).json({
            message: 'The report does not exist.',
        });
    }

    const deletionResult = await storage.deleteOne<ReportDocument>(DBCollections.REPORTS, { _id: reportStorageId });
    if (deletionResult.deletedCount === 0) {
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'The report could not be deleted. Retry or reach out to technical support for more information.',
        });
    }

    return response.status(StatusCodes.OK).json({
        message: 'The report has been deleted.',
    });
};