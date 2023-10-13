import { isValidObject } from './misc';

export const isValidPetRegistrationBody = (body: any) => {
    return isValidObject(body, [
        { name: 'secondaryOwners', type: 'object' },
        { name: 'name', type: 'string', validators: { minLength: 3, maxLength: 20 } },
        { name: 'otherNames', type: 'object', validators: { allowEmpty: true }},
        { name: 'dateOfBirth', type: 'number'},
        { name: 'speciesId', type: 'string' },
        { name: 'size', type: 'string' },
        { name: 'weight', type: 'number' },
        { name: 'description', type: 'string' },
    ]);
};