import { Document, ObjectId } from 'mongodb';

export enum DBCollections {
    USERS = 'users',
    PETS = 'pets',
    REFRESH_TOKENS = 'refreshTokens'
}

export interface UserDocument extends Document {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: number;
    createdAt: number;
    verifiedAccount: boolean;
    emailVerificationToken?: string;
}

export interface PetDocument extends Document {
    owner: ObjectId;
    secondaryOwners?: string[];
    name: string;
    otherNames?: string[];
    dateOfBirth: number;
    speciesId: string;
    size: string;
    weight: number;
    description: string;
    createdAt: number;
    updatedAt: number;
}

export interface RefreshTokenDocument extends Document {
    user: ObjectId;
    token: string;
    createdAt: number;
}