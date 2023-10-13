import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { DBCollections, UserDocument, storage } from '../../db';
import { AccountUpdateBody, TokenDataLocal } from '../../types';

export const updateAccountHandler = async (request: Request<any, any, AccountUpdateBody>, response: Response<any, TokenDataLocal>) => {
    const { tokenData } = response.locals;
    const { id: userId } = request.params;

    if (tokenData.userId !== userId) {
        return response.status(StatusCodes.FORBIDDEN).json({
            message: 'Cannot access the resource.',
        });
    }

    const updatableFields: Record<string, string> = {
        'username': 'string',
        'firstName': 'string',
        'lastName': 'string',
        'dateOfBirth': 'number',
    };

    const skippedFields: { name: string; reason: string; }[] = [];
    const dataToUpdate: Record<string, any> = {};

    for (const field in request.body) {
        if (updatableFields[field] === undefined) {
            skippedFields.push({ name: field, reason: 'Field not allowed for update.' });
            continue;
        }

        if (typeof (request.body as any)[field] !== updatableFields[field]) {
            skippedFields.push({ name: field, reason: `Wrong field type. Expected ${updatableFields[field]}` });
            continue;
        }

        if (updatableFields[field] === 'string') {
            if (((request.body as any)[field] as string).trim().length === 0) {
                skippedFields.push({ name: field, reason: 'Field cannot be empty.' });
                continue;
            }

            (request.body as any)[field] = ((request.body as any)[field] as string).trim();
        }

        dataToUpdate[field] = (request.body as any)[field];
    }

    if (dataToUpdate.username !== undefined) {
        const existentAccount = await storage.findOne<UserDocument>(DBCollections.USERS, { username: dataToUpdate.username, _id: { $ne: new ObjectId(userId) } });
        
        if (existentAccount) {
            skippedFields.push({ name: 'username', reason: 'Username already picked.' });
            delete dataToUpdate.username;
        }
    }

    await storage.updateOne<UserDocument>(DBCollections.USERS, { _id: new ObjectId(userId) }, { $set: dataToUpdate });

    const accountRecord = await storage.findOne<UserDocument>(DBCollections.USERS, { _id: new ObjectId(userId) }, { projection: { 'password': 0 } });

    return response.status(StatusCodes.OK).json({
        account: accountRecord,
        skippedFields,
    });
};