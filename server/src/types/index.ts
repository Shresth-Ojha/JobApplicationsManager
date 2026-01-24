export interface User {
    id: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    profilePictureUrl?: string | null;
}

export interface AuthResponse {
    user: User;
    token: string;
    refreshToken: string;
}
