import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { PetUpdateBody, TokenDataLocal } from '../../types';
import { DBCollections, PetDocument, UserDocument, storage } from '../../db';

export const petUpdateHandler = async (request: Request<any, any, PetUpdateBody>, response: Response<any, TokenDataLocal>) => {
    const petId = request.params.id;
    const { tokenData } = response.locals;

    if (!ObjectId.isValid(petId)) {
        return response.status(StatusCodes.BAD_REQUEST).json({
            message: 'Wrong pet ID format.',
        });
    }

    let petRecord = await storage.findOne<PetDocument>(DBCollections.PETS, { _id: new ObjectId(petId) });
    if (petRecord === null) {
        return response.status(StatusCodes.NOT_FOUND).json({
            message: `Pet with ID ${petId} does not exist.`,
        });
    }

    if (petRecord.owner.toString() !== tokenData.userId) {
        return response.status(StatusCodes.FORBIDDEN).json({
            message: `Cannot access the resource. Pets can only be modified by the owner.`,
        });
    }

    const updatedData: Record<string, any> = {};
    const { name, otherNames, secondaryOwners, speciesId, dateOfBirth, size, weight, description } = request.body;

    if (name && typeof name === 'string' && name.trim().length !== 0) {
        updatedData.name = name;
    }

    if (otherNames && Array.isArray(otherNames)) {
        updatedData.otherNames = [];
        for (const name of otherNames) {
            if (typeof name !== 'string') {
                continue;
            }

            updatedData.otherNames.push(name);
        }
    }

    if (secondaryOwners && Array.isArray(secondaryOwners)) {
        updatedData.secondaryOwners = [];
        for (const ownerId of secondaryOwners) {
            if (typeof ownerId !== 'string' || !ObjectId.isValid(ownerId)) {
                continue
            }

            const ownerRecord = await storage.findOne<UserDocument>(DBCollections.USERS, { _id: new ObjectId(ownerId) });
            if (ownerRecord === null) {
                continue;
            }

            updatedData.secondaryOwners.push(ownerId);
        }
    }

    if (speciesId && typeof speciesId === 'string' && ObjectId.isValid(speciesId)) {
        // TODO: Verify that the species exists in the database given the speciesId.
        
        updatedData.speciesId = speciesId;
    }

    if (dateOfBirth && typeof dateOfBirth === 'number') {
        updatedData.dateOfBirth = dateOfBirth;
    }

    if (size && typeof size === 'string' && ['small', 'medium', 'large'].indexOf(size.toLowerCase()) >= 0) {
        updatedData.size = size.toLowerCase();
    }

    if (weight && typeof weight === 'number') {
        updatedData.weight = weight;
    }

    if (description && typeof description === 'string') {
        updatedData.description = description;
    }

    await storage.updateOne<PetDocument>(DBCollections.PETS, { _id: new ObjectId(petId) }, { $set: updatedData });

    petRecord = await storage.findOne<PetDocument>(DBCollections.PETS, { _id: new ObjectId(petId) });

    return response.status(StatusCodes.OK).json({ pet: petRecord });
};