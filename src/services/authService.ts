import { api } from '@/config/api';
import type { User } from '@/types';

export interface LoginResponse {
    token: string;
    user: User;
}

const authService = {
    async login(email: string, password: string): Promise<LoginResponse | null> {
        const response = await api.post<LoginResponse>('/login', { email, password });
        return response.data.token ? response.data : null;
    },

    logout(): void {
        window.location.href = '/login';
    },

    getToken(): string | null {
        return 'token';
    },
};

export { authService };