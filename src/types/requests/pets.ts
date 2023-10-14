import { ObjectId } from 'mongodb';

export interface PetRegistrationBody {
    secondaryOwners?: string[];
    name: string;
    otherNames?: string[];
    dateOfBirth: number;
    speciesId: string;
    size: string;
    weight: number;
    description: string;
}

export interface PetUpdateBody {
    name?: string;
    otherNames?: string[];
    secondaryOwners?: string[];
    dateOfBirth?: number;
    speciesId?: ObjectId;
    size?: string;
    weight?: string;
    description?: string;
}