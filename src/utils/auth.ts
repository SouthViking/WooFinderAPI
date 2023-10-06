import * as bcrypt from 'bcrypt';

export const PASSWORD_STRENGTH_REQUIREMENTS = [
    'Must contain at least 1 uppercase letter.',
    'Must contain at least 1 special case letter.',
    'Must contain at least 2 digits.',
    'Must contain at least 3 lowercase letters.',
    'Must have a length between 16 and 100 characters.',
];

export const isStrongPassword = (password: string) => {
    /** Validations to define whether the password is strong or not: 
     * 1. Ensure string has one uppercase letter.
     * 2. Ensure string has one special case letter.
     * 3. Ensure string has two digits.
     * 4. Ensure string has three lowercase letters.
     * 5. Ensure string is of length [16, 100].
    */

    return new RegExp('^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{16,100}$').test(password);
};

export const getHashedPassword = (password: string) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};