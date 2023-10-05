import humps from 'humps';
import { NextFunction, Request, Response } from 'express';

export const bodyCamelizer = (request: Request, response: Response, next: NextFunction) => {
    request.body = humps.camelizeKeys(request.body);

    next();
};