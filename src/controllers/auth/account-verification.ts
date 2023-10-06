import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { decodeToken, isValidSignedToken } from '../../utils';
import { AccountVerificationQueryParams } from '../../types';
import { DBCollections, UserDocument, storage } from '../../db';

interface EmailVerificationTokenData {
    iat: number;
    exp: number;
    userId: string;
}

export const accountVerificationHandler = async (
    request: Request<any, any, any, AccountVerificationQueryParams>,
    response: Response,
) => {
    if (request.query.token === undefined) {
        return response.status(StatusCodes.BAD_REQUEST).json({
            message: 'Missing email verification token in query params.',
        });
    }

    if (!isValidSignedToken(request.query.token)) {
        return response.status(StatusCodes.UNAUTHORIZED).json({
            message: 'The email verification token is not valid.',
        });
    }

    const decodedToken = decodeToken<EmailVerificationTokenData>(request.query.token);
    const internalUserId = new ObjectId(decodedToken.userId);

    if (Date.now() > decodedToken.exp) {
        return response.status(StatusCodes.UNAUTHORIZED).json({
            message: 'The token has expired.',
        });
    }

    const userData = await storage.findOne<UserDocument>(DBCollections.USERS, { _id: internalUserId }, { projection: { emailVerificationToken: 1 } });
    if (userData === null) {
        return response.status(StatusCodes.CONFLICT).json({
            message: 'Could not complete the email verification. The account does not exist.',
        });
    }

    if (userData.emailVerificationToken === undefined || userData.emailVerificationToken === null) {
        return response.status(StatusCodes.CONFLICT).json({
            message: 'The account was already verified.',
        });
    }

    const updateResult = await storage.updateOne<UserDocument>(
        DBCollections.USERS,
        { _id: internalUserId },
        { $set: { verifiedAccount: true, emailVerificationToken: null } },
    );

    if (updateResult.modifiedCount === 0) {
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'There has been an internal error. The token could not be verified.',
        });
    }

    return response.status(StatusCodes.OK).json({
        message: 'Email token has been verified.',
    });
};