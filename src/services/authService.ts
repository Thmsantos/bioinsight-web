import { api } from '@/config/api';
import type { User } from '@/types';

export interface LoginResponse {
    token: string;
    user: User;
}

const authService = {
    async login(email: string, password: string): Promise<LoginResponse> {
        const response = await api.post<LoginResponse>('/login', { email, password });
        if (response.data.token) {
        }
        return response.data;
    },

    logout(): void {
        window.location.href = '/login';
    },

    getToken(): string | null {
        return 'token';
    },
};

export { authService };