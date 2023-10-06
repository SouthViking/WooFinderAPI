
export interface RegistrationBody {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    dateOfBirth: number;
}

export interface AccountVerificationQueryParams {
    token?: string;
}