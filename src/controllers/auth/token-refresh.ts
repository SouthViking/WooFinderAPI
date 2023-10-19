import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { DBCollections, RefreshTokenDocument, storage } from '../../db';
import { RefreshTokenPayload, TokenRefreshBody, TokenType } from '../../types';
import { TokenState, decodeToken, generateAccessToken, generateRefreshToken, verifyToken } from '../../utils';

export const tokenRefreshHandler = async (request: Request<any, any, TokenRefreshBody>, response: Response) => {
    const { refreshToken } = request.body;
    if (refreshToken === undefined) {
        return response.status(StatusCodes.BAD_REQUEST).json({
            message: 'The refresh token must be provided.',
        });
    }

    if (typeof refreshToken !== 'string') {
        return response.status(StatusCodes.BAD_REQUEST).json({
            message: 'The refresh token must be a string.',
        });
    }

    const tokenVerificationResult = verifyToken(refreshToken);
    if (tokenVerificationResult !== TokenState.VALID) {
        return response.status(StatusCodes.UNAUTHORIZED).json({
            message: `The refresh token is not valid. Either expired or has a wrong format.`
        });
    }

    const decodedToken = decodeToken<RefreshTokenPayload>(refreshToken);
    if (decodedToken.tokenType !== TokenType.REFRESH) {
        return response.status(StatusCodes.UNAUTHORIZED).json({
            message: 'The token is not a refresh token.',
        });
    }

    const refeshTokenRecord = await storage.findOne<RefreshTokenDocument>(
        DBCollections.REFRESH_TOKENS,
        { user: new ObjectId(decodedToken.userId), token: refreshToken },
    );
    if (refeshTokenRecord === null) {
        return response.status(StatusCodes.UNAUTHORIZED).json({
            message: 'The refresh token has been revoked.',
        });
    }

    const tokenPayload = { userId: decodedToken.userId };
    const newRefreshToken = generateRefreshToken(tokenPayload);

    await storage.deleteOne<RefreshTokenDocument>(DBCollections.REFRESH_TOKENS, { user: new ObjectId(decodedToken.userId), token: refreshToken });
    await storage.insertOne<RefreshTokenDocument>(DBCollections.REFRESH_TOKENS, { user: new ObjectId(decodedToken.userId), token: newRefreshToken, createdAt: Date.now() });
    
    return response.status(StatusCodes.OK).json({
        tokens: {
            access: generateAccessToken(tokenPayload),
            refresh: newRefreshToken,
        },
    });
};