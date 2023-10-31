import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { TokenDataLocal } from '../../types';
import { DBCollections, ReportDocument, storage } from '../../db';

export const reportDetailHandler = async (request: Request<{ id: string; reportId: string; }>, response: Response<any, TokenDataLocal>) => {
    const { id: petId, reportId } = request.params;

    if (!ObjectId.isValid(petId) || !ObjectId.isValid(reportId)) {
        return response.status(StatusCodes.BAD_REQUEST).json({
            message: 'Either the pet or report ID have a wrong format.',
        });
    }

    const reportRecord = await storage.findOne<ReportDocument>(DBCollections.REPORTS, { petId: new ObjectId(petId), _id: new ObjectId(reportId) });
    if (!reportRecord) {
        return response.status(StatusCodes.NOT_FOUND).json({
            message: 'The report does not exist.',
        });
    }

    return response.status(StatusCodes.OK).json(reportRecord);
};