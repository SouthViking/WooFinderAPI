import { StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';

import { AccessTokenPayload } from '../types';
import { TokenState, decodeToken, verifyToken } from '../utils';

export const accessTokenVerification = (request: Request, response: Response, next: NextFunction) => {
    const token = request.headers.authorization;
    if (token === undefined) {
        return response.status(StatusCodes.UNAUTHORIZED).json({
            message: 'Access token not provided.',
        });
    }

    if (!token.startsWith('Bearer ')) {
        return response.status(StatusCodes.BAD_REQUEST).json({
            message: 'Wrong access token format.',
        });
    }

    const cleanToken: string | undefined = token.split(' ')[1];
    if (cleanToken === undefined) {
        return response.status(StatusCodes.BAD_REQUEST).json({
            message: 'Wrong access token format.',
        });
    }

    const tokenState = verifyToken(cleanToken);

    if (tokenState === TokenState.EXPIRED) {
        return response.status(StatusCodes.UNAUTHORIZED).json({
            message: 'Access token has expired.',
        });
    }

    if (tokenState === TokenState.GENERAL_ERROR) {
        return response.status(StatusCodes.BAD_REQUEST).json({
            message: 'Wrong access token format.'
        });
    }

    const decodedToken = decodeToken<AccessTokenPayload>(cleanToken);

    response.locals = { tokenData: decodedToken };

    next();
};