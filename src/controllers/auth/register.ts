import { RegistrationBody } from '../../types';
import { isValidRegistrationBody } from '../../validators';
import { DBCollections, UserDocument, storage } from '../../db';
import { PASSWORD_STRENGTH_REQUIREMENTS, generateEmailVerificationToken, getHashedPassword, isStrongPassword } from '../../utils';

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const registrationHandler = async (request: Request<any, any, RegistrationBody>, response: Response) => {
    const { isValid: isValidBody, fields } = isValidRegistrationBody(request.body);

    if (!isValidBody) {
        return response.status(StatusCodes.BAD_REQUEST).json({
            message: 'Bad request format. Either wrong or missing fields.',
            fields,
        });
    }

    const existentUserRecord = await storage.findOne<UserDocument>(DBCollections.USERS, {
        $or: [
            { username: request.body.username },
            { email: request.body.email },
        ],
    });

    if (existentUserRecord !== null) {
        return response.status(StatusCodes.CONFLICT).json({
            message: `Username (${request.body.username}) or email (${request.body.email}) already taken.`,
        });
    }

    if (!isStrongPassword(request.body.password)) {
        return response.status(StatusCodes.BAD_REQUEST).json({
            message: 'The provided password does not meet the strength requirements.',
            passwordRequirements: PASSWORD_STRENGTH_REQUIREMENTS,
        });
    }

    const result = await storage.insertOne<UserDocument>(DBCollections.USERS, {
        username: request.body.username,
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        email: request.body.email,
        dateOfBirth: request.body.dateOfBirth,
        createdAt: Date.now(),
        password: getHashedPassword(request.body.password),
        verifiedAccount: false,
    });

    // TODO: Send verification email with the generated token.
    const emailVerificationToken = generateEmailVerificationToken(result.insertedId.toString());
    await storage.updateOne<UserDocument>(DBCollections.USERS, { _id: result.insertedId }, { $set: { emailVerificationToken } });

    return response.status(StatusCodes.CREATED).json({
        id: result.insertedId,
    });
};