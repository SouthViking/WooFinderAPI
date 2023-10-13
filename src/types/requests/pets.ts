
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