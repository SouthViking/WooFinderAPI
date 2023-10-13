import { Request, Response } from 'express';
import { TokenDataLocal } from '../../types';
import { StatusCodes } from 'http-status-codes';
import { DBCollections, UserDocument, storage } from '../../db';
import { ObjectId } from 'mongodb';

export const getAccountHandler = async (request: Request, response: Response<any, TokenDataLocal>) => {
    const { tokenData } = response.locals;
    const { id: userId } = request.params;

    if (tokenData.userId !== userId) {
        return response.status(StatusCodes.FORBIDDEN).json({
            message: 'Cannot access the resource.',
        });
    }

    const accountRecord = await storage.findOne<UserDocument>(DBCollections.USERS, { _id: new ObjectId(userId) }, { projection: { password: 0 } });
    if (accountRecord === null) {
        return response.status(StatusCodes.NOT_FOUND).json({
            message: 'Could not find the account.',
        });
    } 

    return response.status(StatusCodes.OK).json(accountRecord);
};