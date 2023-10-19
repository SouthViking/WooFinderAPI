
export enum TokenType {
    ACCESS,
    REFRESH
}

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

export interface TokenBasePayload {
    iat: number;
    exp: number;
    tokenType: TokenType;
}

export interface AccessTokenPayload extends TokenBasePayload {
    userId: string;
}

export interface RefreshTokenPayload extends TokenBasePayload {
    userId: string;
}

export interface TokenDataLocal {
    tokenData: AccessTokenPayload;
}

export interface AccountUpdateBody {
    username?: string;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: number;
}

export interface TokenRefreshBody {
    refreshToken: string;
}