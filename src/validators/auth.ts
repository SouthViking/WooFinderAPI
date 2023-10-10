import { isValidObject } from './misc';

export const isValidRegistrationBody = (body: any) => {
    return isValidObject(body, [
        { name: 'username', type: 'string', validators: { minLength: 5, maxLength: 30 } },
        { name: 'password', type: 'string', validators: { minLength: 16, maxLength: 100 } },
        { name: 'firstName', type: 'string', validators: { maxLength: 50 } },
        { name: 'lastName', type: 'string', validators: { maxLength: 50 } },
        { name: 'email', type: 'string', validators: { maxLength: 320 } },
        { name: 'dateOfBirth', type: 'number' },
    ]);
};

export const isValidLoginBody = (body: any) => {
    return isValidObject(body, [
        { name: 'identity', type: 'string' },
        { name: 'password', type: 'string' },
    ]);
};