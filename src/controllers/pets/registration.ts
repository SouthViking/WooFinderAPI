import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { isValidPetRegistrationBody } from '../../validators';
import { PetRegistrationBody, TokenDataLocal } from '../../types';
import { DBCollections, PetDocument, UserDocument, storage } from '../../db';

export const petRegistrationHandler = async (request: Request<any, any, PetRegistrationBody>, response: Response<any, TokenDataLocal>) => {
    const { isValid: isValidBody, fields } = isValidPetRegistrationBody(request.body);

    if (!isValidBody) {
        return response.status(StatusCodes.BAD_REQUEST).json({
            message: 'Bad request format. Either wrong or missing fields.',
            fields,
        });
    }

    const { tokenData } = response.locals;

    const userRecord = await storage.findOne<UserDocument>(DBCollections.USERS, { _id: new ObjectId(tokenData.userId) });
    if (!userRecord) {
        return response.status(StatusCodes.NOT_FOUND).json({
            message: 'Account not found.',
        });
    }

    request.body.size = request.body.size.toLowerCase();

    if (['small', 'medium', 'large'].indexOf(request.body.size) < 0) {
        return response.status(StatusCodes.BAD_REQUEST).json({
            message: 'Incorrect pet size provided.',
        });
    }

    const newPetResult = await storage.insertOne<PetDocument>(DBCollections.PETS, {
        owner: new ObjectId(tokenData.userId),
        name: request.body.name,
        otherNames: request.body.otherNames,
        secondaryOwners: request.body.secondaryOwners,
        dateOfBirth: request.body.dateOfBirth,
        speciesId: request.body.speciesId,
        size: request.body.size,
        weight: request.body.weight,
        description: request.body.description,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    });

    return response.status(StatusCodes.CREATED).json({
        id: newPetResult.insertedId.toString(),
    });
};