import { ObjectId, WithId } from 'mongodb';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { LoginBody } from '../../types';
import { isValidLoginBody } from '../../validators';
import { DBCollections, RefreshTokenDocument, UserDocument, storage } from '../../db';
import { generateAccessToken, generateRefreshToken, isCorrectPassword } from '../../utils';

export const loginHandler = async (request: Request<any, any, LoginBody>, response: Response) => {
    const { isValid: isValidBody, fields } = isValidLoginBody(request.body);

    if (!isValidBody) {
        return response.status(StatusCodes.BAD_REQUEST).json({
            message: 'Bad request format. Either wrong or missing fields',
            fields,
        });
    }

    const userRecord = await storage.findOne<WithId<UserDocument>>(DBCollections.USERS, { $or: [
        { username: request.body.identity }, { email: request.body.identity },
    ] }, { projection: { password: 1 } });

    if (!userRecord) {
        return response.status(StatusCodes.UNAUTHORIZED).json({
            message: 'Could not authenticate with the given credentials.',
        });
    }

    if (!isCorrectPassword(request.body.password, userRecord.password)) {
        return response.status(StatusCodes.UNAUTHORIZED).json({
            message: 'Could not authenticate with the given credentials.',
        });
    }

    const tokenPayload = { userId: userRecord._id.toString() };
    const refreshToken = generateRefreshToken(tokenPayload);

    await storage.insertOne<RefreshTokenDocument>(DBCollections.REFRESH_TOKENS, {
        token: refreshToken,
        user: new ObjectId(tokenPayload.userId),
        createdAt: Date.now(),
    });


    return response.status(StatusCodes.OK).json({
        tokens: {
            access: generateAccessToken(tokenPayload),
            refresh: refreshToken,
        },
    });
};