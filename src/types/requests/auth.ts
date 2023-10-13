
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

export interface LoginBody {
    /** Either the username or the email of the account. */ 
    identity: string;
    password: string;
}

export interface AccessTokenPayload {
    iat: number;
    exp: number;
    userId: string;
}