import { RegistrationBody } from '../../types';
import { isValidRegistrationBody } from '../../validators';
import { PASSWORD_STRENGTH_REQUIREMENTS, isStrongPassword } from '../../utils';

import { StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';

export const registrationHandler = (request: Request<any, any, RegistrationBody>, response: Response, next: NextFunction) => {
    const { isValid: isValidBody, fields } = isValidRegistrationBody(request.body);

    if (!isValidBody) {
        return response.status(StatusCodes.BAD_REQUEST).json({
            message: 'Bad request format. Either wrong or missing fields.',
            fields,
        });
    }

    if (!isStrongPassword(request.body.password)) {
        return response.status(StatusCodes.BAD_REQUEST).json({
            message: 'The provided password does not meet the strength requirements.',
            passwordRequirements: PASSWORD_STRENGTH_REQUIREMENTS,
        });
    }

    // TODO: Business logic

    return response.status(StatusCodes.CREATED).json({});
};