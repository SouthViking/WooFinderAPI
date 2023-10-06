import { Document } from 'mongodb';

export enum DBCollections {
    USERS = 'users',
}

export interface UserDocument extends Document {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: number;
    createdAt: number;
}