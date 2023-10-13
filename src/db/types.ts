import { Document } from 'mongodb';

export enum DBCollections {
    USERS = 'users',
    PETS = 'pets',
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
    secondaryOwners?: string[];
    name: string;
    otherNames?: string[];
    dateOfBirth: number;
    speciesId: string;
    size: string;
    weight: number;
    description: string;
}