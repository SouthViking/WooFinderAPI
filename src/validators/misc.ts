import * as humps from 'humps';

interface Validators {
    minLength?: number;
    maxLength?: number;
    allowEmpty?: boolean;

    minValue?: number;
    maxValue?: number;
}

interface ExpectedFieldDefinition {
    name: string;
    type: string;
    validators?: Validators;
}

// TODO: Evaluate third-party libraries that support body validation.
export const isValidObject = (object: Record<string, any>, expectedFields: ExpectedFieldDefinition[]) => {
    let isValid = true;
    const fieldsWithError: { field: string; message: string; }[] = []

    for (const expectedField of expectedFields) {
        const decamelizedField = humps.decamelize(expectedField.name);

        if (object[expectedField.name] === undefined || object[expectedField.name] === null) {
            isValid = false;

            fieldsWithError.push({ field: decamelizedField, message: 'Missing field.' });
            continue;
        }

        if (typeof object[expectedField.name] !== expectedField.type) {
            isValid = false;

            fieldsWithError.push({ field: decamelizedField, message: 'Unexpected type.' });
            continue;
        }

        if (!expectedField.validators) {
            continue;
        }

        if (typeof object[expectedField.name] === 'string') {

            object[expectedField.name] = object[expectedField.name].trim();

            const { minLength, maxLength, allowEmpty } = expectedField.validators;

            if (minLength !== undefined && object[expectedField.name].length < minLength) {
                isValid = false;

                fieldsWithError.push({ field: decamelizedField, message: `Minimum length: ${minLength}.` });
                continue;
            }

            if (maxLength !== undefined && object[expectedField.name].length > maxLength) {
                isValid = false;

                fieldsWithError.push({ field: decamelizedField, message: `Maximum length: ${maxLength}.` });
                continue;
            }

            if ((allowEmpty === false || allowEmpty === undefined) && object[expectedField.name].length === 0) {
                isValid = false;

                fieldsWithError.push({ field: decamelizedField, message: 'Cannot be empty.' });
                continue;
            }

        } else if (typeof object[expectedField.name] === 'number') {
            const { minValue, maxValue } = expectedField.validators;

            if (minValue !== undefined && object[expectedField.name] < minValue) {
                isValid = false;

                fieldsWithError.push({ field: decamelizedField, message: `Minimum value: ${minValue}` });
                continue;
            }

            if (maxValue !== undefined && object[expectedField.name] > maxValue) {
                isValid = false;

                fieldsWithError.push({ field: decamelizedField, message: `Maximum value: ${maxValue}` });
                continue;
            }
        }

    }

    return {
        isValid,
        fields: fieldsWithError,
    };
}