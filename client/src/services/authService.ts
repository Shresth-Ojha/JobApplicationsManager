import api from '@/lib/api';

export interface User {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    profilePictureUrl?: string;
}

export interface AuthResponse {
    user: User;
    token: string;
    refreshToken: string;
}

export const authService = {
    async login(email: string, password: string): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/login', { email, password });
        return response.data;
    },

    async register(email: string, password: string, firstName?: string, lastName?: string): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/register', {
            email,
            password,
            firstName,
            lastName,
        });
        return response.data;
    },

    async updateProfile(data: Partial<User>): Promise<{ user: User }> {
        const response = await api.put<{ user: User }>('/auth/profile', data);
        return response.data;
    },

    async updatePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
        const response = await api.put<{ message: string }>('/auth/password', { currentPassword, newPassword });
        return response.data;
    },

    async logout() {
        // In a real app, you might call an endpoint to invalidate tokens
        localStorage.removeItem('auth-storage');
    },
};
