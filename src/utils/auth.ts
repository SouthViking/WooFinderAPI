import * as path from 'path';

import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { TokenType } from '../types';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export enum TokenState {
    VALID,
    EXPIRED,
    GENERAL_ERROR
}

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

export const isCorrectPassword = (plainPassword: string, hashedPassword: string) => {
    return bcrypt.compareSync(plainPassword, hashedPassword);
};

export const generateAccessToken = (data: any) => {
    const payload = {
        ...data,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
        tokenType: TokenType.ACCESS,
    };

    return jwt.sign(payload, process.env.SECRET_KEY!);
};

export const generateRefreshToken = (data: any) => {
    const payload = {
        ...data,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
        tokenType: TokenType.REFRESH,
    };

    return jwt.sign(payload, process.env.SECRET_KEY!); 
};

export const generateEmailVerificationToken = (userId: string) => {
    const payload = {
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 3),
        userId,
    };

    return jwt.sign(payload, process.env.SECRET_KEY!);
};

export const verifyToken = (token: string) => {
    try {
        jwt.verify(token, process.env.SECRET_KEY!);

        return TokenState.VALID;

    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            return TokenState.EXPIRED;
        }
        return TokenState.GENERAL_ERROR;
    }
}

export const decodeToken = <T>(token: string) => {
    return jwt.decode(token) as T;
};